const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '..', 'data', 'projects.json');

function readProjects() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeProjects(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Helper to filter/mask project data based on role
function filterProject(project, role) {
  if (role === 'admin') return project;
  
  const isApproved = project.approvalStatus === 'approved';
  if (!isApproved) return null; // Non-admins only see approved stuff

  if (project.visibility === 'private' && role !== 'user') {
    // Mask private fields for public users
    const masked = { ...project };
    const allowed = project.visibleFields || ['title', 'pi', 'domain', 'shortDescription'];
    Object.keys(masked).forEach(key => {
      if (!allowed.includes(key) && !['id', 'visibility', 'status', 'approvalStatus'].includes(key)) {
        delete masked[key];
      }
    });
    masked.isLocked = true; // Flag for frontend "LockOverlay"
    return masked;
  }
  
  return project;
}

// GET /api/projects — role-based filtering
router.get('/', (req, res) => {
  try {
    const projects = readProjects();
    // We don't have auth middleware here to allow public access, 
    // so we check for the token header manually if present
    const authHeader = req.headers.authorization;
    let role = 'public';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const config = require('../data/config.json');
        const decoded = jwt.verify(authHeader.split(' ')[1], config.jwtSecret);
        role = decoded.role;
      } catch (e) {}
    }

    const filtered = projects
      .map(p => filterProject(p, role))
      .filter(p => p !== null);

    res.json(filtered);
  } catch (err) {
    console.error('Read projects error:', err);
    res.status(500).json({ error: 'Failed to read projects.' });
  }
});

// GET /api/projects/:id
router.get('/:id', (req, res) => {
  try {
    const projects = readProjects();
    const project = projects.find(p => p.id === req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found.' });

    // Role check for detail view
    const authHeader = req.headers.authorization;
    let role = 'public';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const config = require('../data/config.json');
        const decoded = jwt.verify(authHeader.split(' ')[1], config.jwtSecret);
        role = decoded.role;
      } catch (e) {}
    }

    const filtered = filterProject(project, role);
    if (!filtered) return res.status(403).json({ error: 'Access denied.' });

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read project.' });
  }
});

// POST /api/projects
router.post('/', authMiddleware, (req, res) => {
  try {
    const projects = readProjects();
    const role = req.admin ? req.admin.role : 'user';
    
    const newProject = {
      id: `proj-${uuidv4().slice(0, 8)}`,
      ...req.body,
      approvalStatus: role === 'admin' ? 'approved' : 'pending_add',
      submitter: req.admin ? { name: req.admin.name, id: req.admin.id } : null,
      createdAt: new Date().toISOString()
    };
    
    projects.push(newProject);
    writeProjects(projects);
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project.' });
  }
});

// PUT /api/projects/:id
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const projects = readProjects();
    const index = projects.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Project not found.' });

    const role = req.admin ? req.admin.role : 'user';
    
    if (role === 'admin') {
      // Admins can overwrite directly
      projects[index] = { ...projects[index], ...req.body, id: req.params.id, approvalStatus: 'approved' };
    } else {
      // For users, we stage the changes for comparison
      projects[index].approvalStatus = 'pending_edit';
      projects[index].pendingChanges = { ...req.body };
      projects[index].editRequestedBy = req.admin ? { name: req.admin.name, id: req.admin.id } : null;
      projects[index].editRequestedAt = new Date().toISOString();
    }
    
    writeProjects(projects);
    res.json(projects[index]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project.' });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    let projects = readProjects();
    const index = projects.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Project not found.' });

    const role = req.admin ? req.admin.role : 'user';
    
    if (role === 'admin') {
      projects.splice(index, 1);
    } else {
      projects[index].approvalStatus = 'pending_delete';
    }
    
    writeProjects(projects);
    res.json({ message: role === 'admin' ? 'Project deleted.' : 'Deletion pending approval.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project.' });
  }
});

module.exports = router;
