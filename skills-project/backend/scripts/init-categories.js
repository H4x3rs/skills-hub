const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

const DEFAULT_CATEGORIES = [
  { name: 'ai', displayName: 'AI/ML', description: 'Artificial Intelligence and Machine Learning', order: 1 },
  { name: 'data', displayName: 'Data Processing', description: 'Data processing and analysis tools', order: 2 },
  { name: 'web', displayName: 'Web Development', description: 'Web development frameworks and tools', order: 3 },
  { name: 'devops', displayName: 'DevOps', description: 'DevOps and infrastructure tools', order: 4 },
  { name: 'security', displayName: 'Security', description: 'Security and authentication tools', order: 5 },
  { name: 'tools', displayName: 'Development Tools', description: 'General development tools and utilities', order: 6 },
];

async function initCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skills-hub');
    console.log('Connected to MongoDB');

    for (const cat of DEFAULT_CATEGORIES) {
      const existing = await Category.findOne({ name: cat.name });
      if (!existing) {
        await Category.create(cat);
        console.log(`Created category: ${cat.name} (${cat.displayName})`);
      } else {
        console.log(`Category already exists: ${cat.name}`);
      }
    }

    console.log('Categories initialization completed');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error initializing categories:', error);
    process.exit(1);
  }
}

initCategories();
