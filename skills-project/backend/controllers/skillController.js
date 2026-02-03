const Skill = require('../models/Skill');
const User = require('../models/User');

const getAllSkills = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = { status: 'published' }; // Only return published skills
    
    const skills = await Skill.find(query)
      .populate('author', 'username fullName avatar')
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

const getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate('author', 'username fullName avatar');
    
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    // Increment download count
    if (req.query.incrementView) {
      await Skill.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } });
      skill.downloads += 1;
    }
    
    res.json({ skill });
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching skill' });
  }
};

const createSkill = async (req, res) => {
  try {
    const { name, description, version, category, tags, repositoryUrl, documentationUrl, demoUrl, license } = req.body;
    
    // Validate that user is authorized to publish
    const user = await User.findById(req.user.userId);
    if (!user || !['admin', 'publisher'].includes(user.role)) {
      return res.status(403).json({ error: 'Not authorized to publish skills' });
    }
    
    const skill = new Skill({
      name,
      description,
      version,
      category,
      tags,
      repositoryUrl,
      documentationUrl,
      demoUrl,
      license,
      author: req.user.userId,
      status: 'pending_review' // Set to pending review initially
    });
    
    await skill.save();
    
    // Populate author info before returning
    await skill.populate('author', 'username fullName avatar');
    
    res.status(201).json({
      message: 'Skill created successfully and is pending review',
      skill
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    
    res.status(500).json({ error: 'Server error while creating skill' });
  }
};

const updateSkill = async (req, res) => {
  try {
    const { name, description, version, category, tags, repositoryUrl, documentationUrl, demoUrl, license, status } = req.body;
    
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    // Check authorization - owner or admin can update
    if (skill.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this skill' });
    }
    
    // Prepare update object
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (version) updateData.version = version;
    if (category) updateData.category = category;
    if (tags) updateData.tags = tags;
    if (repositoryUrl) updateData.repositoryUrl = repositoryUrl;
    if (documentationUrl) updateData.documentationUrl = documentationUrl;
    if (demoUrl) updateData.demoUrl = demoUrl;
    if (license) updateData.license = license;
    if (status && req.user.role === 'admin') updateData.status = status; // Only admins can change status
    updateData.lastUpdated = Date.now();
    
    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'username fullName avatar');
    
    res.json({
      message: 'Skill updated successfully',
      skill: updatedSkill
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    
    res.status(500).json({ error: 'Server error while updating skill' });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    // Check authorization - owner or admin can delete
    if (skill.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this skill' });
    }
    
    await Skill.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error while deleting skill' });
  }
};

const searchSkills = async (req, res) => {
  try {
    const { q, category, tags, page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build query
    const query = { status: 'published' };
    
    if (q) {
      query.$text = { $search: q }; // Use text index for search
    }
    
    if (category) {
      query.category = category;
    }
    
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',');
      query.tags = { $in: tagArray.map(tag => new RegExp(tag.trim(), 'i')) };
    }
    
    const skills = await Skill.find(query)
      .populate('author', 'username fullName avatar')
      .sort({ downloads: -1 }) // Sort by downloads by default
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Skill.countDocuments(query);
    
    res.json({
      skills,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalSkills: total,
        hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error while searching skills' });
  }
};

const getPopularSkills = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    const skills = await Skill.find({ status: 'published' })
      .populate('author', 'username fullName avatar')
      .sort({ downloads: -1 })
      .limit(limit);
    
    res.json({ skills });
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching popular skills' });
  }
};

const getLatestSkills = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    const skills = await Skill.find({ status: 'published' })
      .populate('author', 'username fullName avatar')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.json({ skills });
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching latest skills' });
  }
};

module.exports = {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  searchSkills,
  getPopularSkills,
  getLatestSkills
};