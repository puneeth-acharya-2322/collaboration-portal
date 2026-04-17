const User = require('../models/User');
const Project = require('../models/Project');
const Request = require('../models/Request');

const getDashboardData = (req, res) => {
  try {
    const users = User.find();
    const projects = Project.find();
    const requests = Request.find();

    const pendingUsers = users.filter(u => u.status === 'pending');
    const pendingProjects = projects.filter(p => p.approvalStatus === 'pending_approval');
    
    // Detailed Projects Enrichment
    const enrichedProjects = projects.map(p => {
      const pi = users.find(u => u.id === p.createdBy);
      const projectRequests = requests.filter(r => r.projectId === p.id);
      return {
        ...p,
        piName: pi ? pi.name : 'Unknown',
        piEmail: pi ? pi.email : 'Unknown',
        requestsCount: projectRequests.length
      };
    });

    // Detailed Faculty Enrichment
    const enrichedFaculty = users.filter(u => u.role === 'user').map(u => {
      const userProjects = projects.filter(p => p.createdBy === u.id);
      return {
        ...u,
        projectsCount: userProjects.length
      };
    });

    // Enriched Requests (already in place but keeping for feed)
    const enrichedRequests = requests.map(r => {
      const applicant = users.find(u => u.id === r.applicantId);
      const project = projects.find(p => p.id === r.projectId);
      return {
        ...r,
        applicantName: applicant ? applicant.name : 'Unknown',
        projectTitle: project ? project.title : 'Unknown'
      };
    });

    res.json({
      success: true,
      data: {
        stats: {
          pendingProjects: pendingProjects.length,
          liveProjects: projects.filter(p => p.approvalStatus === 'approved').length,
          totalUsers: users.filter(u => u.status === 'approved' && u.role === 'user').length,
          pendingUsers: pendingUsers.length,
          totalRequests: requests.length,
          pendingDeletions: projects.filter(p => p.pendingDeletion).length,
          pendingUpdates: projects.filter(p => p.pendingUpdates !== null).length,
          // Placeholder deltas
          pendingProjectsDelta: '+2 since yesterday',
          totalUsersDelta: 'Active faculty accounts'
        },
        pendingUsers,
        pendingProjects: enrichedProjects.filter(p => p.approvalStatus === 'pending_approval'),
        deletionRequests: enrichedProjects.filter(p => p.pendingDeletion),
        updateRequests: enrichedProjects.filter(p => p.pendingUpdates !== null),
        allProjects: enrichedProjects.filter(p => p.approvalStatus === 'approved'),
        allFaculty: enrichedFaculty,
        allRequests: enrichedRequests
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const approveDeletion = (req, res) => {
  try {
    const success = Project.delete(req.params.id);
    if (!success) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const rejectDeletion = (req, res) => {
  try {
    const project = Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    Project.update(req.params.id, project.createdBy, { pendingDeletion: false });
    res.json({ success: true, message: 'Deletion request rejected' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const approveEdit = (req, res) => {
  try {
    const project = Project.findById(req.params.id);
    if (!project || !project.pendingUpdates) return res.status(404).json({ success: false, message: 'Project update not found' });
    
    // Merge updates and clear the request
    const updates = { ...project.pendingUpdates, pendingUpdates: null };
    Project.update(req.params.id, project.createdBy, updates);
    
    res.json({ success: true, message: 'Project update approved and published' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const rejectEdit = (req, res) => {
  try {
    const project = Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    Project.update(req.params.id, project.createdBy, { pendingUpdates: null });
    res.json({ success: true, message: 'Project update rejected' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const approveUser = (req, res) => {
  try {
    const user = User.update(req.params.id, { status: 'approved' });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const rejectUser = (req, res) => {
  try {
    const user = User.update(req.params.id, { status: 'rejected' });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const approveProject = (req, res) => {
  try {
    const projects = Project.find();
    const index = projects.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Project not found' });
    
    projects[index].approvalStatus = 'approved';
    Project.saveCollection(projects);
    
    res.json({ success: true, data: projects[index] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const rejectProject = (req, res) => {
  try {
    const projects = Project.find();
    const index = projects.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Project not found' });
    
    projects[index].approvalStatus = 'rejected';
    Project.saveCollection(projects);
    
    res.json({ success: true, data: projects[index] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getDashboardData,
  approveUser,
  rejectUser,
  approveProject,
  rejectProject,
  approveDeletion,
  rejectDeletion,
  approveEdit,
  rejectEdit
};
