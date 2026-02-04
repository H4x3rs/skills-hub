/**
 * Migration: Change Skill unique index from (author, name) to (name)
 * Run: npm run migrate-skill-index (from skills-project)
 *
 * Name is globally unique; same skill can have multiple versions.
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

async function migrate() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/skillshub';
  console.log('Connecting to MongoDB...');

  await mongoose.connect(mongoUri);
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database connection not ready');
  }

  try {
    const collection = db.collection('skills');
    const indexes = await collection.indexes();

    // Drop compound (author, name) index if exists
    const authorNameIndex = indexes.find(
      (i) => i.key && 'author' in i.key && 'name' in i.key && Object.keys(i.key).length === 2
    );
    if (authorNameIndex) {
      try {
        await collection.dropIndex(authorNameIndex.name);
        console.log('Dropped index:', authorNameIndex.name);
      } catch (e) {
        if (e.codeName === 'IndexNotFound' || e.message?.includes('index not found')) {
          console.log('Index already removed');
        } else throw e;
      }
    } else {
      console.log('No (author, name) index found');
    }

    console.log('Migration complete. Restart the server to apply the new (name) unique index.');
  } finally {
    await mongoose.disconnect();
  }
}

migrate().catch((err) => {
  console.error('Migration failed:', err.message || err);
  process.exit(1);
});
