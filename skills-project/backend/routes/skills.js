const express = require('express');
const { getAllSkills, getSkillById, createSkill, updateSkill, deleteSkill, searchSkills, getPopularSkills, getLatestSkills } = require('../controllers/skillController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllSkills);
router.get('/popular', getPopularSkills);
router.get('/latest', getLatestSkills);
router.get('/search', searchSkills);
router.get('/:id', getSkillById);
router.post('/', authenticateToken, authorizeRole(['admin', 'publisher']), createSkill);
router.put('/:id', authenticateToken, authorizeRole(['admin', 'publisher']), updateSkill);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), deleteSkill);

module.exports = router;