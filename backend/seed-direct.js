const mongoose = require('mongoose');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/micro-learning', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    
    // Clear existing data
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    console.log('Database cleared');

    // Sample courses data
    const coursesData = [
      {
        title: 'React Fundamentals',
        slug: 'react-fundamentals',
        description: 'Master the basics of React with hands-on projects and real-world examples.',
        category: 'Frontend',
        difficulty: 'beginner',
        tags: ['react', 'javascript', 'frontend', 'ui'],
        estimatedDuration: 120,
        isPublished: true,
        featured: true
      },
      {
        title: 'Node.js Backend Development',
        slug: 'nodejs-backend',
        description: 'Build scalable backend applications with Node.js, Express, and MongoDB.',
        category: 'Backend',
        difficulty: 'intermediate',
        tags: ['nodejs', 'express', 'mongodb', 'api'],
        estimatedDuration: 180,
        isPublished: true,
        featured: true
      },
      {
        title: 'Advanced JavaScript Concepts',
        slug: 'advanced-javascript',
        description: 'Deep dive into advanced JavaScript features like closures, promises, and async/await.',
        category: 'Programming',
        difficulty: 'advanced',
        tags: ['javascript', 'es6', 'async', 'closures'],
        estimatedDuration: 150,
        isPublished: true,
        featured: false
      },
      {
        title: 'Database Design Principles',
        slug: 'database-design',
        description: 'Learn database design, normalization, and best practices for data modeling.',
        category: 'Database',
        difficulty: 'intermediate',
        tags: ['database', 'sql', 'normalization', 'design'],
        estimatedDuration: 90,
        isPublished: true,
        featured: false
      },
      {
        title: 'DevOps Fundamentals',
        slug: 'devops-fundamentals',
        description: 'Introduction to DevOps practices, CI/CD pipelines, and cloud deployment.',
        category: 'DevOps',
        difficulty: 'beginner',
        tags: ['devops', 'ci-cd', 'docker', 'aws'],
        estimatedDuration: 200,
        isPublished: true,
        featured: true
      },
      {
        title: 'TypeScript for React',
        slug: 'typescript-react',
        description: 'Build type-safe React applications with TypeScript and modern development tools.',
        category: 'Frontend',
        difficulty: 'intermediate',
        tags: ['typescript', 'react', 'types', 'frontend'],
        estimatedDuration: 160,
        isPublished: true,
        featured: false
      }
    ];

    const createdCourses = await Course.insertMany(coursesData);
    console.log(`${createdCourses.length} courses created successfully`);

    // Create sample lessons for each course
    const lessonsData = [];
    
    createdCourses.forEach((course, courseIndex) => {
      const lessonCount = Math.floor(Math.random() * 5) + 3; // 3-7 lessons per course
      
      for (let i = 1; i <= lessonCount; i++) {
        lessonsData.push({
          course: course._id,
          title: `Lesson ${i}: ${course.title.split(' ')[0]} Basics`,
          slug: `${course.slug}-lesson-${i}`,
          order: i,
          content: `This is lesson ${i} of the ${course.title} course. Learn essential concepts and practical examples.`,
          lessonType: i % 2 === 0 ? 'code' : 'text',
          duration: Math.floor(Math.random() * 20) + 10, // 10-30 minutes
          isPublished: true
        });
      }
    });

    const createdLessons = await Lesson.insertMany(lessonsData);
    console.log(`${createdLessons.length} lessons created successfully`);

    // Update courses with lesson references
    for (const course of createdCourses) {
      const courseLessons = createdLessons.filter(lesson => lesson.course.toString() === course._id.toString());
      course.lessons = courseLessons.map(lesson => lesson._id);
      await course.save();
    }

    console.log('Database seeded successfully!');
    console.log('Sample courses created:');
    createdCourses.forEach(course => {
      console.log(`- ${course.title} (${course.lessons.length} lessons)`);
    });

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedDatabase(); 