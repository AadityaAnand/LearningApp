const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const multer = require('multer');

// Models
const User = require('./models/User');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');
const Progress = require('./models/Progress');
const LearningPlan = require('./models/LearningPlan');

// Middleware
const { auth } = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');

// Utils
const { sendEmail } = require('./utils/email');
const llmService = require('./utils/llm');

const app = express();

// Multer configuration for file uploads
const upload = multer({ storage: multer.memoryStorage() });

app.set('trust proxy', 1); // Trust first proxy

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- ROUTES ---

// --- AUTH ROUTES ---
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

app.post('/api/auth/register', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('careerGoal').trim().notEmpty().withMessage('Career goal is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { email, password, firstName, lastName, careerGoal } = req.body;
    // In a real app, you would handle file upload here (e.g., with multer)
    // and save the resume to a storage service like S3.
    // For now, we'll just simulate a resume URL.
    const resumeUrl = req.body.resume ? `/uploads/resumes/placeholder.pdf` : '';

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = new User({ email, password, firstName, lastName, careerGoal, resumeUrl });
    await user.save();
    
    // --- LLM Integration ---
    // Generate personalized learning plan using LLM
    let learningPlanStructure;
    try {
      // In a real implementation, you would parse the resume PDF to extract text
      // For now, we'll use a placeholder resume text
      const resumeText = req.body.resume ? "Resume content would be extracted here" : "";
      
      learningPlanStructure = await llmService.generateLearningPlan(resumeText, careerGoal);
      console.log('Learning plan generated successfully using LLM');
    } catch (error) {
      console.error('LLM generation failed, using fallback plan:', error);
      // Fallback to mock plan if LLM fails
      learningPlanStructure = {
        title: `Your Personalized Plan to become a ${careerGoal.substring(0,20)}...`,
        summary: `A comprehensive learning journey designed to help you transition into ${careerGoal}.`,
        modules: [
          { 
            title: "Module 1: Foundational Skills", 
            description: "Build the core fundamentals needed for your career transition",
            lessons: [
              {
                title: "Lesson 1.1: Introduction to Programming",
                description: "Learn basic programming concepts",
                duration: "60",
                difficulty: "beginner",
                resources: ["Video Lectures", "Interactive Exercises"]
              },
              {
                title: "Lesson 1.2: Problem Solving",
                description: "Develop algorithmic thinking",
                duration: "90",
                difficulty: "beginner",
                resources: ["Practice Problems", "Code Challenges"]
              }
            ]
          },
          { 
            title: "Module 2: Core Concepts", 
            description: "Master the specific technologies relevant to your career goal",
            lessons: [
              {
                title: "Lesson 2.1: Modern Web Development",
                description: "Learn HTML, CSS, JavaScript",
                duration: "120",
                difficulty: "intermediate",
                resources: ["Project-Based Learning", "Documentation"]
              },
              {
                title: "Lesson 2.2: Backend Development",
                description: "Build server-side applications",
                duration: "150",
                difficulty: "intermediate",
                resources: ["Hands-on Projects", "API Documentation"]
              }
            ]
          },
          { 
            title: "Module 3: Advanced Topics", 
            description: "Dive deep into advanced concepts and real-world applications",
            lessons: [
              {
                title: "Lesson 3.1: System Design",
                description: "Design scalable systems",
                duration: "180",
                difficulty: "advanced",
                resources: ["Case Studies", "Architecture Patterns"]
              },
              {
                title: "Lesson 3.2: DevOps & Deployment",
                description: "Master deployment and infrastructure",
                duration: "120",
                difficulty: "intermediate",
                resources: ["Cloud Platforms", "Automation Tools"]
              }
            ]
          }
        ],
        estimatedDuration: "40 hours",
        prerequisites: ["Basic computer literacy", "Willingness to learn"],
        learningOutcomes: [
          "Proficiency in modern programming languages",
          "Understanding of software development lifecycle",
          "Ability to build and deploy applications",
          "Problem-solving and algorithmic thinking skills"
        ]
      };
    }
    
    const learningPlan = new LearningPlan({
      user: user._id,
      structure: learningPlanStructure,
    });
    await learningPlan.save();
    
    user.learningPlan = learningPlan._id;
    await user.save();

    // We can skip email verification for this new flow to simplify
    const token = generateToken(user._id);
    res.status(201).json({ success: true, message: 'User registered and learning plan created!', token, user: user.getProfile() });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

app.post('/api/auth/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    user.lastLogin = Date.now();
    await user.save();
    const token = generateToken(user._id);
    res.json({ success: true, message: 'Login successful', token, user: user.getProfile() });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

app.post('/api/auth/logout', auth, async (req, res) => {
  try {
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Server error during logout' });
  }
});

app.get('/api/auth/me', auth, async (req, res) => {
  try {
    res.json({ success: true, user: req.user.getProfile() });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/auth/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ 
      emailVerificationToken: token, 
      emailVerificationExpires: { $gt: Date.now() } 
    });
    
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
    }
    
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ success: false, message: 'Server error during email verification' });
  }
});

app.post('/api/auth/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();
    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Password Reset - Micro Learning Platform',
      html: `<h2>Password Reset Request</h2><p>Click the link below to reset your password:</p><a href="${resetUrl}">Reset Password</a><p>This link will expire in 1 hour.</p>`
    });
    
    res.json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Server error during password reset' });
  }
});

app.post('/api/auth/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    const { token, password } = req.body;
    const user = await User.findOne({ 
      passwordResetToken: token, 
      passwordResetExpires: { $gt: Date.now() } 
    });
    
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }
    
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    
    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error during password reset' });
  }
});

// --- USER ROUTES ---

app.get('/api/users/profile', auth, async (req, res) => {
    try {
        res.json({ success: true, user: req.user.getProfile() });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.put('/api/users/profile', auth, [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('username').optional().isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/).withMessage('Username must be 3-30 characters and contain only letters, numbers, and underscores')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    const { firstName, lastName, username } = req.body;
    
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Username already taken' });
      }
    }
    
    if (firstName) req.user.firstName = firstName;
    if (lastName) req.user.lastName = lastName;
    if (username) req.user.username = username;
    
    await req.user.save();
    res.json({ success: true, user: req.user.getProfile() });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error during profile update' });
  }
});

app.put('/api/users/password', auth, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    const { currentPassword, newPassword } = req.body;
    const isMatch = await req.user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    
    req.user.password = newPassword;
    await req.user.save();
    
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Server error during password change' });
  }
});

// --- COURSE ROUTES ---

app.get('/api/courses', async (req, res) => {
    try {
        const { category, difficulty, search, page = 1, limit = 10 } = req.query;
        const query = { isPublished: true };
        if (category) query.category = category;
        if (difficulty) query.difficulty = difficulty;
        if (search) query.$text = { $search: search };
        const courses = await Course.find(query)
            .populate('lessons', 'title order')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const total = await Course.countDocuments(query);
        res.json({ courses, totalPages: Math.ceil(total / limit), currentPage: page, total });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/courses/:slug', async (req, res) => {
    try {
        const course = await Course.findOne({ slug: req.params.slug, isPublished: true })
            .populate('lessons', 'title order slug duration');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json({ course });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// --- LESSON ROUTES ---

app.get('/api/lessons/:slug', async (req, res) => {
    try {
        const lesson = await Lesson.findOne({ slug: req.params.slug, isPublished: true }).populate('course', 'title slug');
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        const lessons = await Lesson.find({ course: lesson.course._id, isPublished: true }).sort({ order: 1 });
        const currentIndex = lessons.findIndex(l => l._id.toString() === lesson._id.toString());
        const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
        const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
        res.json({
            lesson,
            navigation: {
                next: nextLesson ? { slug: nextLesson.slug, title: nextLesson.title } : null,
                prev: prevLesson ? { slug: prevLesson.slug, title: prevLesson.title } : null,
                currentIndex: currentIndex + 1,
                totalLessons: lessons.length
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// --- LEARNING PLAN ROUTES ---

// Get current user's learning plan
app.get('/api/learning-plans/current', auth, async (req, res) => {
  try {
    const learningPlan = await LearningPlan.findOne({ user: req.user._id });
    
    if (!learningPlan) {
      return res.status(404).json({ 
        success: false, 
        message: 'No learning plan found. Please complete your registration.' 
      });
    }

    // Calculate progress metrics
    const totalLessons = learningPlan.structure.modules?.reduce((total, module) => 
      total + (module.lessons?.length || 0), 0) || 0;
    
    const completedLessons = 0; // This would be calculated from Progress model in a real implementation
    
    res.json({
      success: true,
      learningPlan: {
        ...learningPlan.toObject(),
        totalLessons,
        completedLessons,
        progressPercentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
      }
    });
  } catch (error) {
    console.error('Error fetching learning plan:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update learning plan progress
app.put('/api/learning-plans/progress', auth, async (req, res) => {
  try {
    const { progress, status } = req.body;
    
    const learningPlan = await LearningPlan.findOne({ user: req.user._id });
    if (!learningPlan) {
      return res.status(404).json({ success: false, message: 'Learning plan not found' });
    }

    if (progress !== undefined) {
      learningPlan.progress = Math.max(0, Math.min(100, progress));
    }
    
    if (status && ['not-started', 'in-progress', 'completed'].includes(status)) {
      learningPlan.status = status;
    }

    await learningPlan.save();
    
    res.json({ success: true, learningPlan });
  } catch (error) {
    console.error('Error updating learning plan:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Regenerate learning plan (for when user wants to update their goals)
app.post('/api/learning-plans/regenerate', auth, async (req, res) => {
  try {
    const { careerGoal } = req.body;
    
    if (!careerGoal) {
      return res.status(400).json({ success: false, message: 'Career goal is required' });
    }

    // Generate new learning plan using LLM
    let newPlanStructure;
    try {
      // Use existing resume text if available, otherwise empty string
      const resumeText = req.user.resumeUrl ? "Resume content would be extracted here" : "";
      
      newPlanStructure = await llmService.generateLearningPlan(resumeText, careerGoal);
      console.log('Learning plan regenerated successfully using LLM');
    } catch (error) {
      console.error('LLM regeneration failed, using fallback plan:', error);
      // Fallback to mock plan if LLM fails
      newPlanStructure = {
        title: `Updated Plan to become a ${careerGoal.substring(0, 30)}...`,
        summary: `A comprehensive learning journey designed to help you transition into ${careerGoal}.`,
        modules: [
          { 
            title: "Module 1: Updated Foundations", 
            description: "Build the core fundamentals needed for your career transition",
            lessons: [
              {
                title: "Updated Lesson 1.1: Advanced Programming",
                description: "Master advanced programming concepts",
                duration: "90",
                difficulty: "intermediate",
                resources: ["Advanced Tutorials", "Complex Exercises"]
              },
              {
                title: "Updated Lesson 1.2: System Architecture",
                description: "Learn system design principles",
                duration: "120",
                difficulty: "advanced",
                resources: ["Architecture Patterns", "Case Studies"]
              }
            ]
          },
          { 
            title: "Module 2: Advanced Core Concepts", 
            description: "Master advanced technologies relevant to your career goal",
            lessons: [
              {
                title: "Updated Lesson 2.1: Advanced Web Development",
                description: "Learn advanced frontend and backend concepts",
                duration: "180",
                difficulty: "advanced",
                resources: ["Advanced Projects", "Performance Optimization"]
              },
              {
                title: "Updated Lesson 2.2: Cloud Architecture",
                description: "Design and deploy cloud-native applications",
                duration: "150",
                difficulty: "advanced",
                resources: ["Cloud Platforms", "Microservices"]
              }
            ]
          },
          { 
            title: "Module 3: Specialized Topics", 
            description: "Focus on specialized areas relevant to your career goal",
            lessons: [
              {
                title: "Updated Lesson 3.1: Machine Learning Integration",
                description: "Integrate ML into your applications",
                duration: "200",
                difficulty: "advanced",
                resources: ["ML Frameworks", "Real-world Projects"]
              },
              {
                title: "Updated Lesson 3.2: Security & Best Practices",
                description: "Implement security best practices",
                duration: "120",
                difficulty: "intermediate",
                resources: ["Security Guidelines", "Penetration Testing"]
              }
            ]
          }
        ],
        estimatedDuration: "50 hours",
        prerequisites: ["Intermediate programming skills", "Basic system design knowledge"],
        learningOutcomes: [
          "Expert-level programming skills",
          "Advanced system design capabilities",
          "Cloud-native application development",
          "Security-first development practices"
        ]
      };
    }

    let learningPlan = await LearningPlan.findOne({ user: req.user._id });
    
    if (learningPlan) {
      learningPlan.structure = newPlanStructure;
      learningPlan.progress = 0;
      learningPlan.status = 'not-started';
    } else {
      learningPlan = new LearningPlan({
        user: req.user._id,
        structure: newPlanStructure,
        progress: 0,
        status: 'not-started'
      });
    }

    await learningPlan.save();
    
    // Update user's career goal
    req.user.careerGoal = careerGoal;
    await req.user.save();

    res.json({ 
      success: true, 
      message: 'Learning plan regenerated successfully',
      learningPlan 
    });
  } catch (error) {
    console.error('Error regenerating learning plan:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get recent progress/activity
app.get('/api/progress/recent', auth, async (req, res) => {
  try {
    // In a real implementation, this would fetch from the Progress model
    // For now, return mock data
    const mockProgress = [
      {
        _id: '1',
        lesson: { title: 'React Hooks Basics' },
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        score: 95
      },
      {
        _id: '2',
        lesson: { title: 'JavaScript Promises' },
        completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        score: 88
      }
    ];

    res.json({ success: true, progress: mockProgress });
  } catch (error) {
    console.error('Error fetching recent progress:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Micro-learning API is running' });
});

// --- ROADMAP GENERATION ENDPOINT ---
app.post('/api/roadmap/generate', upload.single('resume'), async (req, res) => {
  try {
    const { role } = req.body;
    if (!req.file || !role) {
      return res.status(400).json({ success: false, message: 'Resume and desired role are required.' });
    }
    // In a real implementation, you would parse the resume and send it to the LLM here.
    // For now, return a mock roadmap.
    const mockRoadmap = {
      title: `Roadmap to become a ${role}`,
      skills: [
        'Skill 1: Foundations',
        'Skill 2: Core Concepts',
        'Skill 3: Advanced Topics'
      ],
      courses: [
        { title: 'Course 1', description: 'Introductory course', materials: ['Video', 'Article'] },
        { title: 'Course 2', description: 'Intermediate course', materials: ['Book', 'Project'] },
        { title: 'Course 3', description: 'Advanced course', materials: ['Research Paper', 'Case Study'] }
      ]
    };
    res.json({ success: true, roadmap: mockRoadmap });
  } catch (error) {
    console.error('Roadmap generation error:', error);
    res.status(500).json({ success: false, message: 'Server error during roadmap generation.' });
  }
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// --- ADMIN & SEEDING ROUTES ---

// Middleware to check for admin role
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as an admin' });
  }
};

// Seeder function
async function seedDatabase() {
  try {
    // Clear existing data
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await User.deleteMany({});
    await Progress.deleteMany({});

    console.log('--- Database Cleared ---');

    // Create a sample user
    const user = new User({
      firstName: 'Admin',
      lastName: 'User',
      username: 'adminuser',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
      isEmailVerified: true,
    });
    await user.save();
    console.log('Admin user created');

    // Sample courses and lessons data
    const coursesData = [
      {
        title: 'React Basics',
        slug: 'react-basics',
        description: 'Learn the fundamentals of React, the most popular library for building user interfaces.',
        category: 'Frontend',
        difficulty: 'beginner',
        tags: ['react', 'javascript', 'frontend'],
        isPublished: true,
        lessons: []
      },
      {
        title: 'Node.js Essentials',
        slug: 'nodejs-essentials',
        description: 'A comprehensive guide to building scalable backend applications with Node.js.',
        category: 'Backend',
        difficulty: 'intermediate',
        tags: ['nodejs', 'javascript', 'backend'],
        isPublished: true,
        lessons: []
      }
    ];

    const createdCourses = await Course.insertMany(coursesData);
    console.log(`${createdCourses.length} courses created.`);

    const lessonsData = [
      // React Basics Lessons
      { course: createdCourses[0]._id, title: 'Introduction to React', slug: 'intro-to-react', order: 1, content: 'What is React and why should you use it? This lesson covers the core concepts.', lessonType: 'text', duration: 10 },
      { course: createdCourses[0]._id, title: 'Setting up Your First React App', slug: 'setup-react-app', order: 2, content: 'A step-by-step guide to creating a new React project using Create React App.', lessonType: 'code', duration: 15 },
      { course: createdCourses[0]._id, title: 'Understanding Components', slug: 'react-components', order: 3, content: 'Learn about functional and class components, the building blocks of React applications.', lessonType: 'text', duration: 12 },
      
      // Node.js Essentials Lessons
      { course: createdCourses[1]._id, title: 'Introduction to Node.js', slug: 'intro-to-nodejs', order: 1, content: 'An overview of Node.js, its architecture, and its role in modern web development.', lessonType: 'text', duration: 8 },
      { course: createdCourses[1]._id, title: 'Creating a Simple HTTP Server', slug: 'nodejs-http-server', order: 2, content: 'Learn to build a basic web server from scratch using the native `http` module.', lessonType: 'code', duration: 20 },
      { course: createdCourses[1]._id, title: 'Working with Express.js', slug: 'expressjs-basics', order: 3, content: 'Discover how the Express framework simplifies building robust APIs and web applications.', lessonType: 'code', duration: 18 }
    ];

    const createdLessons = await Lesson.insertMany(lessonsData);
    console.log(`${createdLessons.length} lessons created.`);

    // Link lessons to courses
    for (const lesson of createdLessons) {
      const course = await Course.findById(lesson.course);
      course.lessons.push(lesson._id);
      await course.save();
    }
    console.log('Lessons linked to courses.');

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Seed route - protected to run only in development
app.post('/api/courses/seed', async (req, res) => {
  if (process.env.NODE_ENV === 'development') {
    try {
      await seedDatabase();
      res.status(200).json({ success: true, message: 'Database seeded successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error seeding database', error: error.message });
    }
  } else {
    res.status(403).json({ success: false, message: 'Seeding is only allowed in development environment' });
  }
});

// --- DATABASE CONNECTION ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/micro-learning');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

connectDB();

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 