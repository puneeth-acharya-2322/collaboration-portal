const express = require('express');
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');
const PROJECTS_FILE = path.join(__dirname, '..', 'data', 'projects.json');

function readData(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Middleware to ensure role is admin
function adminOnly(req, res, next) {
  if (req.admin && req.admin.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Unauthorized. Admin access required.' });
  }
}

router.use(authMiddleware);
router.use(adminOnly);

// GET /api/admin/pending-users
router.get('/pending-users', (req, res) => {
  try {
    const users = readData(USERS_FILE);
    const pending = users.filter(u => u.approvalStatus === 'pending');
    res.json(pending);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending users.' });
  }
});

// POST /api/admin/approve-user/:id
router.post('/approve-user/:id', (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const users = readData(USERS_FILE);
    const index = users.findIndex(u => u.id === req.params.id);
    
    if (index === -1) return res.status(404).json({ error: 'User not found.' });
    
    users[index].approvalStatus = status || 'approved';
    writeData(USERS_FILE, users);
    
    res.json({ message: `User ${status || 'approved'} successfully.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve user.' });
  }
});

// GET /api/admin/pending-projects
router.get('/pending-projects', (req, res) => {
  try {
    const projects = readData(PROJECTS_FILE);
    const pending = projects.filter(p => p.approvalStatus && p.approvalStatus !== 'approved');
    res.json(pending);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending projects.' });
  }
});

// POST /api/admin/approve-project/:id
router.post('/approve-project/:id', (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const projects = readData(PROJECTS_FILE);
    const index = projects.findIndex(p => p.id === req.params.id);
    
    if (index === -1) return res.status(404).json({ error: 'Project not found.' });
    
    const project = projects[index];

    if (status === 'approved') {
      if (project.approvalStatus === 'pending_edit' && project.pendingChanges) {
        // Merge pending changes into the main record
        projects[index] = { 
          ...project, 
          ...project.pendingChanges, 
          approvalStatus: 'approved' 
        };
        delete projects[index].pendingChanges;
        delete projects[index].editRequestedBy;
        delete projects[index].editRequestedAt;
      } else {
        projects[index].approvalStatus = 'approved';
      }
    } else {
      projects[index].approvalStatus = 'rejected';
      // We keep the pending changes so the user can see why they were rejected if needed, 
      // or we can delete them. For now, let's just clear the flag.
    }
    
    writeData(PROJECTS_FILE, projects);
    res.json({ message: `Project ${status || 'approved'} successfully.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve project.' });
  }
});

module.exports = router;
