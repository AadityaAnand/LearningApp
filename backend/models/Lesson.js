const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: true
  },
  lessonType: {
    type: String,
    enum: ['text', 'code', 'video', 'quiz', 'interactive'],
    default: 'text'
  },
  order: {
    type: Number,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  tags: [{
    type: String,
    trim: true
  }],
  codeExamples: [{
    language: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    description: String
  }],
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['link', 'file', 'video']
    }
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search functionality
lessonSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Ensure unique order within a course
lessonSchema.index({ course: 1, order: 1 }, { unique: true });

module.exports = mongoose.model('Lesson', lessonSchema); 