const User = require('../models/User');
const Skill = require('../models/Skill');

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
    
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching dashboard stats' });
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
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching users' });
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
      skills,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalSkills: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching skills' });
  }
};

const updateSkillStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['draft', 'published', 'archived', 'pending_review'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
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
      message: 'Skill status updated successfully',
      skill: updatedSkill
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    
    res.status(500).json({ error: 'Server error while updating skill status' });
  }
};

const manageUserRoles = async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'publisher', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role value' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Prevent demoting oneself as admin
    if (user._id.toString() === req.user.userId && role !== 'admin') {
      return res.status(400).json({ error: 'Cannot change your own role' });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      message: 'User role updated successfully',
      user: updatedUser
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    
    res.status(500).json({ error: 'Server error while updating user role' });
  }
};

module.exports = {
  getDashboardStats,
  getUsersForAdmin,
  getSkillsForAdmin,
  updateSkillStatus,
  manageUserRoles
};