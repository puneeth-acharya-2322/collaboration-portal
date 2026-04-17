const User = require('../models/User');

const getProfile = (req, res) => {
  try {
    const user = User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { password, ...safeUser } = user;
    res.status(200).json({ success: true, data: safeUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getAllResearchers = (req, res) => {
  try {
    const reqUsers = User.find().filter(u => u.role === 'user' && u.status === 'approved');
    const safeUsers = reqUsers.map(u => {
      const { password, ...safeU } = u;
      return safeU;
    });
    res.status(200).json({ success: true, data: safeUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const updateProfile = (req, res) => {
  try {
    const allowedUpdates = ['name', 'skills', 'domain', 'availability', 'bio', 'department', 'designation', 'institution', 'preferences'];
    const updates = {};
    
    for (const key in req.body) {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    }

    const updatedUser = User.update(req.user.id, updates);
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { password, ...safeUser } = updatedUser;
    res.status(200).json({ success: true, data: safeUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = { getProfile, updateProfile, getAllResearchers };
