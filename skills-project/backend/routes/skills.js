const express = require('express');
const { 
  getAllSkills, 
  getSkillById, 
  createSkill, 
  updateSkill, 
  deleteSkill, 
  searchSkills, 
  getPopularSkills, 
  getLatestSkills,
  // 管理员专用功能
  getAllSkillsForAdmin,
  createSkillForAdmin,
  updateSkillForAdmin,
  deleteSkillForAdmin
} = require('../controllers/skillController');
const { authenticateToken, authorizeRole, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllSkills);
router.get('/popular', getPopularSkills);
router.get('/latest', getLatestSkills);
router.get('/search', searchSkills);
router.get('/:id', getSkillById);

// Authenticated routes (for publishers and admins)
router.post('/', authenticateToken, authorizeRole(['admin', 'publisher']), createSkill);
router.put('/:id', authenticateToken, authorizeRole(['admin', 'publisher']), updateSkill);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), deleteSkill);

// Admin-only routes for enhanced skill management
router.get('/admin/all', authenticateToken, authorizeAdmin, getAllSkillsForAdmin);
router.post('/admin/create', authenticateToken, authorizeAdmin, createSkillForAdmin);
router.put('/admin/:id', authenticateToken, authorizeAdmin, updateSkillForAdmin);
router.delete('/admin/:id', authenticateToken, authorizeAdmin, deleteSkillForAdmin);

module.exports = router;