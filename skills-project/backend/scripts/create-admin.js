const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const DEFAULT_ADMIN = {
  username: 'admin',
  email: 'admin@botskill.ai',
  password: '13403487291ren.',  // 强密码，符合8位以上要求
  fullName: 'Administrator',
  role: 'admin'
};

async function createDefaultAdmin() {
  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/botskill');
    console.log('Connected to database');

    // 如果已存在相同用户名或邮箱的用户，先删除
    const existingUser = await User.findOne({
      $or: [
        { username: DEFAULT_ADMIN.username },
        { email: DEFAULT_ADMIN.email }
      ]
    });

    if (existingUser) {
      await User.deleteOne({ _id: existingUser._id });
      console.log('Removed existing user:', existingUser.email);
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