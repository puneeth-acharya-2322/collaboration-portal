const Request = require('../models/Request');
const Project = require('../models/Project');
const User = require('../models/User');

/**
 * POST /api/requests
 * Body: { projectId, message, skills, experience, availability }
 */
const createRequest = (req, res) => {
  try {
    const { projectId, message, skills, experience, availability } = req.body;
    
    // Verify project exists
    const project = Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    // Check if user already applied
    const existingReq = Request.findByApplicant(req.user.id).find(r => r.projectId === projectId);
    if (existingReq) {
      return res.status(400).json({ success: false, message: 'You have already applied to this project' });
    }

    const request = Request.create({
      projectId,
      applicantId: req.user.id,
      message,
      skills,
      experience,
      availability
    });
    
    res.status(201).json({ success: true, data: request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * GET /api/requests/my-received
 * Get all requests targeted at projects I created
 */
const getMyReceivedRequests = (req, res) => {
  try {
    const myProjects = Project.findByCreator(req.user.id);
    const myProjectIds = myProjects.map(p => p.id);
    
    // Find all requests where the projectId is in myProjectIds
    let requests = Request.find().filter(r => myProjectIds.includes(r.projectId));
    
    // Enrich requests with Applicant profile info and Project title
    requests = requests.map(r => {
      const applicant = User.findById(r.applicantId);
      const project = myProjects.find(p => p.id === r.projectId);
      return {
        ...r,
        applicantName: applicant ? applicant.name : 'Unknown',
        applicantEmail: applicant ? applicant.email : 'Unknown',
        projectTitle: project ? project.title : 'Unknown'
      };
    });

    res.json({ success: true, data: requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * PUT /api/requests/:id
 * Body: { status: 'accepted' | 'rejected' }
 */
const updateRequestStatus = (req, res) => {
  try {
    const request = Request.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    
    // Verify I own the project this request is for
    const project = Project.findById(request.projectId);
    if (!project || project.createdBy !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const updated = Request.update(request.id, { status });
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  createRequest,
  getMyReceivedRequests,
  updateRequestStatus
};
