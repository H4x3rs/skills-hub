const express = require('express');
const { getDashboardStats, getUsersForAdmin, getSkillsForAdmin, updateSkillStatus, manageUserRoles } = require('../controllers/adminController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', authenticateToken, authorizeAdmin, getDashboardStats);
router.get('/users', authenticateToken, authorizeAdmin, getUsersForAdmin);
router.get('/skills', authenticateToken, authorizeAdmin, getSkillsForAdmin);
router.put('/skills/:id/status', authenticateToken, authorizeAdmin, updateSkillStatus);
router.put('/users/:id/role', authenticateToken, authorizeAdmin, manageUserRoles);

module.exports = router;