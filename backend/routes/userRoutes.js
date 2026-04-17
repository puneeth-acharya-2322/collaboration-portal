const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getAllResearchers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/all', getAllResearchers);

router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

module.exports = router;
