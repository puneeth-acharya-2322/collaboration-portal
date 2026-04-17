const express = require('express');
const router = express.Router();
const { 
  createRequest, 
  getMyReceivedRequests, 
  updateRequestStatus 
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createRequest);
router.get('/my-received', getMyReceivedRequests);
router.put('/:id', updateRequestStatus);

module.exports = router;
