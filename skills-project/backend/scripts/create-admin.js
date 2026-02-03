const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const DEFAULT_ADMIN = {
  username: 'admin',
  email: 'admin@skills-hub.com',
  password: 'Admin123!@#',  // 强密码，符合8位以上要求
  fullName: 'System Administrator',
  role: 'admin'
};

async function createDefaultAdmin() {
  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillshub');
    console.log('Connected to database');

    // 检查是否已存在管理员账户
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      process.exit(0);
    }

    // 检查是否已存在相同用户名或邮箱的用户
    const existingUser = await User.findOne({
      $or: [
        { username: DEFAULT_ADMIN.username },
        { email: DEFAULT_ADMIN.email }
      ]
    });

    if (existingUser) {
      console.log('User with same username or email already exists:', existingUser.email);
      process.exit(0);
    }

    // 创建默认管理员账户
    const adminUser = new User({
      username: DEFAULT_ADMIN.username,
      email: DEFAULT_ADMIN.email,
      password: DEFAULT_ADMIN.password,
      fullName: DEFAULT_ADMIN.fullName,
      role: DEFAULT_ADMIN.role
    });

    await adminUser.save();
    console.log('Default admin user created successfully!');
    console.log('Username:', DEFAULT_ADMIN.username);
    console.log('Email:', DEFAULT_ADMIN.email);
    console.log('Password:', DEFAULT_ADMIN.password); // 在生产环境中不应打印密码

  } catch (error) {
    console.error('Error creating default admin:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// 运行函数
createDefaultAdmin();