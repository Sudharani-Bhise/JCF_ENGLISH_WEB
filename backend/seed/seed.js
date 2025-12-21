require('dotenv').config();
const connectDB = require('../config/db');
const Course = require('../models/Course');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function seed() {
  await connectDB();
  await Course.deleteMany();
  await User.deleteMany();

  const courses = [
    { name: 'Basic Spoken English', description: 'Beginner friendly' },
    { name: 'Advanced Conversation', description: 'Fluency practice' }
  ];
  await Course.insertMany(courses);

  const hashed = await bcrypt.hash('admin123', 10);
  await User.create({ name: 'Admin', email: 'admin@gmail.com', password: hashed, role: 'admin' });

  console.log('Seed complete');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
