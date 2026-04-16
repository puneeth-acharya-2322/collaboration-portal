const express = require('express');
const router = express.Router();
const { getPublicProjects } = require('../controllers/projectController');

// GET /api/projects/public
router.get('/public', getPublicProjects);

module.exports = router;
