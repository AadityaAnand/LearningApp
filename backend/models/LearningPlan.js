const mongoose = require('mongoose');

const learningPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // The generated plan from the LLM will be stored here.
  // Using Mixed type to allow for a flexible structure (e.g., array of modules with lessons).
  structure: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  // To track the overall progress of the user on their plan.
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LearningPlan', learningPlanSchema); 