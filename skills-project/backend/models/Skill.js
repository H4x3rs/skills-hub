const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    maxlength: [100, 'Skill name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  version: {
    type: String,
    default: '1.0.0',
    match: [/^(\d+)\.(\d+)\.(\d+)$/, 'Version must be in format X.Y.Z']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['ai', 'data', 'web', 'devops', 'security', 'tools'],
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  downloads: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  license: {
    type: String,
    default: 'MIT'
  },
  repositoryUrl: {
    type: String,
    match: [/^https?:\/\/.*/, 'Please enter a valid URL']
  },
  documentationUrl: {
    type: String,
    match: [/^https?:\/\/.*/, 'Please enter a valid URL']
  },
  demoUrl: {
    type: String,
    match: [/^https?:\/\/.*/, 'Please enter a valid URL']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'pending_review'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for common queries
skillSchema.index({ name: 'text', description: 'text', tags: 'text' });
skillSchema.index({ category: 1, status: 1 });
skillSchema.index({ downloads: -1 }); // For popular skills
skillSchema.index({ createdAt: -1 }); // For latest skills

module.exports = mongoose.model('Skill', skillSchema);