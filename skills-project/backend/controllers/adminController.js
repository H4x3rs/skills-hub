const User = require('../models/User');
const Skill = require('../models/Skill');
const Role = require('../models/Role');
const Permission = require('../models/Permission');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSkills = await Skill.countDocuments();
    const publishedSkills = await Skill.countDocuments({ status: 'published' });
    const pendingSkills = await Skill.countDocuments({ status: 'pending_review' });
    const totalDownloads = await Skill.aggregate([
      { $group: { _id: null, total: { $sum: '$downloads' } } }
    ]);
    
    const stats = {
      totalUsers,
      totalSkills,
      publishedSkills,
      pendingSkills,
      totalDownloads: totalDownloads.length > 0 ? totalDownloads[0].total : 0
    };
    
    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while fetching dashboard stats',
      message: error.message
    });
  }
};

const getUsersForAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await User.countDocuments();
    
    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while fetching users',
      message: error.message
    });
  }
};

const getSkillsForAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const statusFilter = req.query.status || null;
    
    const query = {};
    if (statusFilter) {
      query.status = statusFilter;
    }
    
    const skills = await Skill.find(query)
      .populate('author', 'username fullName avatar email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Skill.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        skills,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalSkills: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while fetching skills',
      message: error.message
    });
  }
};

const updateSkillStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['draft', 'published', 'archived', 'pending_review'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value'
      });
    }
    
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        error: 'Skill not found'
      });
    }
    
    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(status === 'published' && !skill.publishedAt ? { publishedAt: new Date() } : {})
      },
      { new: true, runValidators: true }
    ).populate('author', 'username fullName avatar');
    
    res.json({
      success: true,
      message: 'Skill status updated successfully',
      data: { skill: updatedSkill }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while updating skill status',
      message: error.message
    });
  }
};

const manageUserRoles = async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'publisher', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role value'
      });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Prevent demoting oneself as admin
    if (user._id.toString() === req.user.userId && role !== 'admin') {
      return res.status(400).json({
        success: false,
        error: 'Cannot change your own role'
      });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      success: true,
      message: 'User role updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while updating user role',
      message: error.message
    });
  }
};

// 角色管理相关功能
const getRoles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const query = {};
    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }
    
    const roles = await Role.find(query)
      .populate('permissions', 'name description resource action')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Role.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        roles,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalRoles: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while fetching roles',
      message: error.message
    });
  }
};

const getRoleByName = async (req, res) => {
  try {
    const role = await Role.findOne({ name: req.params.roleName })
      .populate('permissions', 'name description resource action');
    
    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found'
      });
    }
    
    res.json({
      success: true,
      data: { role }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while fetching role',
      message: error.message
    });
  }
};

const createRole = async (req, res) => {
  try {
    const { name, description, permissionIds } = req.body;
    
    // 检查角色名是否已存在
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        error: 'Role with this name already exists'
      });
    }
    
    // 创建新角色
    const newRole = new Role({
      name,
      description,
      permissions: permissionIds || []
    });
    
    await newRole.save();
    
    // 填充权限信息
    await newRole.populate('permissions', 'name description resource action');
    
    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: { role: newRole }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while creating role',
      message: error.message
    });
  }
};

const updateRole = async (req, res) => {
  try {
    const { description, permissionIds, isActive } = req.body;
    
    const updateData = {};
    if (description !== undefined) updateData.description = description;
    if (permissionIds !== undefined) updateData.permissions = permissionIds;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    const updatedRole = await Role.findOneAndUpdate(
      { name: req.params.roleName },
      updateData,
      { new: true, runValidators: true }
    ).populate('permissions', 'name description resource action');
    
    if (!updatedRole) {
      return res.status(404).json({
        success: false,
        error: 'Role not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Role updated successfully',
      data: { role: updatedRole }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while updating role',
      message: error.message
    });
  }
};

const deleteRole = async (req, res) => {
  try {
    const role = await Role.findOneAndDelete({ name: req.params.roleName });
    
    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found'
      });
    }
    
    // 也要从所有用户中移除该角色（如果有的话）
    await User.updateMany(
      { role: req.params.roleName },
      { $set: { role: 'user' } } // 默认降级到普通用户
    );
    
    res.json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while deleting role',
      message: error.message
    });
  }
};

const updateRolePermissions = async (req, res) => {
  try {
    const { permissionIds } = req.body;
    
    const role = await Role.findOne({ name: req.params.roleName });
    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found'
      });
    }
    
    role.permissions = permissionIds;
    await role.save();
    
    // 填充权限信息
    await role.populate('permissions', 'name description resource action');
    
    res.json({
      success: true,
      message: 'Role permissions updated successfully',
      data: { role }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while updating role permissions',
      message: error.message
    });
  }
};

// 权限管理相关功能
const getPermissions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const resourceFilter = req.query.resource || null;
    const actionFilter = req.query.action || null;
    
    const query = {};
    if (resourceFilter) {
      query.resource = resourceFilter;
    }
    if (actionFilter) {
      query.action = actionFilter;
    }
    
    const permissions = await Permission.find(query)
      .sort({ resource: 1, action: 1, name: 1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Permission.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        permissions,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalPermissions: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while fetching permissions',
      message: error.message
    });
  }
};

const createPermission = async (req, res) => {
  try {
    const { name, description, resource, action } = req.body;
    
    // 检查权限名是否已存在
    const existingPermission = await Permission.findOne({ name });
    if (existingPermission) {
      return res.status(400).json({
        success: false,
        error: 'Permission with this name already exists'
      });
    }
    
    const newPermission = new Permission({
      name,
      description,
      resource,
      action
    });
    
    await newPermission.save();
    
    res.status(201).json({
      success: true,
      message: 'Permission created successfully',
      data: { permission: newPermission }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while creating permission',
      message: error.message
    });
  }
};

const updatePermission = async (req, res) => {
  try {
    const { description, resource, action } = req.body;
    
    const updateData = {};
    if (description) updateData.description = description;
    if (resource) updateData.resource = resource;
    if (action) updateData.action = action;
    updateData.updatedAt = Date.now();
    
    const updatedPermission = await Permission.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedPermission) {
      return res.status(404).json({
        success: false,
        error: 'Permission not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Permission updated successfully',
      data: { permission: updatedPermission }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while updating permission',
      message: error.message
    });
  }
};

const deletePermission = async (req, res) => {
  try {
    const permission = await Permission.findByIdAndDelete(req.params.id);
    
    if (!permission) {
      return res.status(404).json({
        success: false,
        error: 'Permission not found'
      });
    }
    
    // 从所有角色中移除该权限
    await Role.updateMany(
      { permissions: req.params.id },
      { $pull: { permissions: req.params.id } }
    );
    
    res.json({
      success: true,
      message: 'Permission deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while deleting permission',
      message: error.message
    });
  }
};

// 用户角色分配功能
const assignRoleToUser = async (req, res) => {
  try {
    const { userId, role } = req.body;
    
    if (!userId || !role) {
      return res.status(400).json({
        success: false,
        error: 'User ID and role are required'
      });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // 验证角色是否存在
    const roleExists = await Role.findOne({ name: role });
    if (!roleExists && !['user', 'publisher', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role value'
      });
    }
    
    // 防止管理员更改自己的角色
    if (user._id.toString() === req.user.userId && role !== 'admin') {
      return res.status(400).json({
        success: false,
        error: 'Cannot change your own role'
      });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      success: true,
      message: 'User role assigned successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while assigning role to user',
      message: error.message
    });
  }
};

// 获取所有用户及其角色
const getUsersWithRoles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const roleFilter = req.query.role || null;
    
    const query = {};
    if (roleFilter) {
      query.role = roleFilter;
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await User.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while fetching users with roles',
      message: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getUsersForAdmin,
  getSkillsForAdmin,
  updateSkillStatus,
  manageUserRoles,
  getRoles,
  getRoleByName,
  createRole,
  updateRole,
  deleteRole,
  updateRolePermissions,
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission,
  assignRoleToUser,
  getUsersWithRoles
};