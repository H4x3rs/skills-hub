/**
 * 初始化默认权限和角色
 * 运行: node scripts/seed-permissions-roles.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Permission = require('../models/Permission');
const Role = require('../models/Role');

const DEFAULT_PERMISSIONS = [
  { name: 'skill_create', description: '创建技能', resource: 'skill', action: 'create' },
  { name: 'skill_read', description: '读取技能', resource: 'skill', action: 'read' },
  { name: 'skill_update', description: '更新技能', resource: 'skill', action: 'update' },
  { name: 'skill_delete', description: '删除技能', resource: 'skill', action: 'delete' },
  { name: 'skill_manage', description: '管理技能', resource: 'skill', action: 'manage' },
  { name: 'user_read', description: '读取用户', resource: 'user', action: 'read' },
  { name: 'user_manage', description: '管理用户', resource: 'user', action: 'manage' },
  { name: 'permission_manage', description: '管理权限', resource: 'permission', action: 'manage' },
  { name: 'role_manage', description: '管理角色', resource: 'role', action: 'manage' },
];

const DEFAULT_ROLES = [
  { name: 'user', description: '普通用户，可浏览和下载技能', permissionNames: ['skill_read'] },
  { name: 'publisher', description: '发布者，可创建和管理自己的技能', permissionNames: ['skill_create', 'skill_read', 'skill_update', 'skill_delete'] },
  { name: 'admin', description: '管理员，拥有所有权限', permissionNames: [] }, // 空表示所有权限
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillshub');
    console.log('Connected to MongoDB\n');

    // 1. 创建权限
    console.log('1. 创建默认权限...');
    const permMap = {};
    for (const p of DEFAULT_PERMISSIONS) {
      let perm = await Permission.findOne({ name: p.name });
      if (!perm) {
        perm = await Permission.create(p);
        console.log(`   ✓ ${p.name}`);
      } else {
        console.log(`   - ${p.name} (已存在)`);
      }
      permMap[p.name] = perm._id;
    }

    // 2. 创建角色并分配权限
    console.log('\n2. 创建默认角色...');
    const allPermIds = Object.values(permMap);
    for (const r of DEFAULT_ROLES) {
      const permissionIds = r.permissionNames.length === 0
        ? allPermIds
        : r.permissionNames.map(n => permMap[n]).filter(Boolean);
      let role = await Role.findOne({ name: r.name });
      if (!role) {
        role = await Role.create({
          name: r.name,
          description: r.description,
          permissions: permissionIds
        });
        console.log(`   ✓ ${r.name}`);
      } else {
        await Role.findByIdAndUpdate(role._id, {
          description: r.description,
          permissions: permissionIds
        });
        console.log(`   ~ ${r.name} (已更新)`);
      }
    }

    console.log('\n✓ 初始化完成');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seed();
