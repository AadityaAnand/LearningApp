const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Models
const User = require('./models/User');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');
const Progress = require('./models/Progress');

// Middleware
const { auth } = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');

// Utils
const { sendEmail } = require('./utils/email');

const app = express();

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
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('username').isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/).withMessage('Username must be 3-30 characters and contain only letters, numbers, and underscores')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { email, password, firstName, lastName, username } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: existingUser.email === email ? 'Email already registered' : 'Username already taken' });
    }
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    const user = new User({ email, password, firstName, lastName, username, emailVerificationToken, emailVerificationExpires });
    await user.save();
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Verify your email - Micro Learning Platform',
      html: `<h2>Welcome to Micro Learning Platform!</h2><p>Please click the link below to verify your email address:</p><a href="${verificationUrl}">Verify Email</a><p>This link will expire in 24 hours.</p>`
    });
    const token = generateToken(user._id);
    res.status(201).json({ success: true, message: 'User registered successfully. Please check your email to verify your account.', token, user: user.getProfile() });
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


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Micro-learning API is running' });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/micro-learning')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 