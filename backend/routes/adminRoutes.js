const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminProtect } = require('../middleware/adminProtect');
const {
  getDashboardData,
  approveUser,
  rejectUser,
  approveProject,
  rejectProject,
  approveDeletion,
  rejectDeletion,
  approveEdit,
  rejectEdit
} = require('../controllers/adminController');

// All routes require both authentication and admin privileges
router.use(protect);
router.use(adminProtect);

router.get('/dashboard', getDashboardData);

router.put('/users/:id/approve', approveUser);
router.put('/users/:id/reject', rejectUser);

router.put('/projects/:id/approve', approveProject);
router.put('/projects/:id/reject', rejectProject);

router.put('/deletions/:id/approve', approveDeletion);
router.put('/deletions/:id/reject', rejectDeletion);

router.put('/edits/:id/approve', approveEdit);
router.put('/edits/:id/reject', rejectEdit);

module.exports = router;
