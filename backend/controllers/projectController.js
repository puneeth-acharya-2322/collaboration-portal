const Project = require('../models/Project');

/**
 * Public endpoint (from Step 1)
 * GET /api/projects/public
 */
function getPublicProjects(req, res) {
  try {
    let projects = Project.find().filter(p => p.approvalStatus !== 'pending_approval');

    const { status, domain, type } = req.query;

    if (status && status !== 'all') {
      projects = projects.filter(p => p.status === status);
    }

    if (domain) {
      const domains = Array.isArray(domain) ? domain : [domain];
      projects = projects.filter(p => domains.includes(p.domain));
    }

    if (type && type !== 'all') {
      projects = projects.filter(p => p.type === type);
    }

    res.json({
      success: true,
      total: projects.length,
      data: projects
    });
  } catch (err) {
    console.error('Error loading projects:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

/**
 * Authenticated endpoint
 * GET /api/projects/all
 */
function getAllProjects(req, res) {
  try {
    // Return all projects that are either approved or created by this user
    let projects = Project.find().filter(p => p.approvalStatus !== 'pending_approval' || p.createdBy === req.user.id);
    
    // Apply filters similarly
    const { status, domain, type } = req.query;
    if (status && status !== 'all') projects = projects.filter(p => p.status === status);
    if (domain) {
      const domains = Array.isArray(domain) ? domain : [domain];
      projects = projects.filter(p => domains.includes(p.domain));
    }
    if (type && type !== 'all') projects = projects.filter(p => p.type === type);

    res.json({
      success: true,
      total: projects.length,
      data: projects
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

/**
 * Authenticated endpoint
 * GET /api/projects/my-projects
 */
function getMyProjects(req, res) {
  try {
    const projects = Project.findByCreator(req.user.id);
    res.json({
      success: true,
      total: projects.length,
      data: projects
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

/**
 * Authenticated endpoint
 * POST /api/projects
 */
function createProject(req, res) {
  try {
    const project = Project.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

/**
 * Authenticated endpoint
 * PUT /api/projects/:id
 */
function updateProject(req, res) {
  try {
    const existing = Project.findById(req.params.id);
    if (!existing || (existing.createdBy !== req.user.id && req.user.role !== 'admin')) {
       return res.status(404).json({ success: false, message: 'Project not found or unauthorised' });
    }

    // If project is already published (approved), any subsequent edit needs re-approval
    // The original remains live while the new data is stored in 'pendingUpdates'
    if (existing.approvalStatus === 'approved') {
      const project = Project.submitEditRequest(req.params.id, req.user.id, req.body);
      return res.json({ success: true, message: 'Update submitted for admin approval', data: project });
    }

    // Otherwise, if it's still pending or rejected, update directly
    const project = Project.update(req.params.id, req.user.id, req.body);
    res.json({ success: true, data: project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

/**
 * Authenticated endpoint
 * DELETE /api/projects/:id
 */
function deleteProject(req, res) {
  try {
    const existing = Project.findById(req.params.id);
    if (!existing || (existing.createdBy !== req.user.id && req.user.role !== 'admin')) {
       return res.status(404).json({ success: false, message: 'Project not found or unauthorised' });
    }

    // If it's already approved, it needs admin approval to be deleted
    if (existing.approvalStatus === 'approved') {
      Project.requestDeletion(req.params.id, req.user.id);
      return res.json({ success: true, message: 'Deletion request submitted for admin approval' });
    }

    // Otherwise, delete immediately
    const success = Project.delete(req.params.id);
    res.json({ success: true, message: 'Project removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}

module.exports = {
  getPublicProjects,
  getAllProjects,
  getMyProjects,
  createProject,
  updateProject,
  deleteProject
};
