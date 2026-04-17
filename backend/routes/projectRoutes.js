const express = require('express');
const router = express.Router();
const { 
  getPublicProjects, 
  getAllProjects, 
  getMyProjects, 
  createProject, 
  updateProject, 
  deleteProject 
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

// Public route
router.get('/public', getPublicProjects);

// Protected routes
router.use(protect);
router.get('/all', getAllProjects);
router.get('/my-projects', getMyProjects);
router.route('/')
  .post(createProject);
router.route('/:id')
  .put(updateProject)
  .delete(deleteProject);

module.exports = router;
