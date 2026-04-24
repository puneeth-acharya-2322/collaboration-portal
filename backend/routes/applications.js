const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');
const { sendApplicationEmail } = require('../services/emailService');
const config = require('../data/config.json');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '..', 'data', 'applications.json');

function readApplications() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeApplications(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// POST /api/applications — public (collaboration form)
router.post('/', async (req, res) => {
  try {
    const { name, institution, email, role, availability, startDate, pitch } = req.body;

    // Validate required fields
    const errors = [];
    if (!name || !name.trim()) errors.push('Full name is required.');
    if (!institution || !institution.trim()) errors.push('Institution is required.');
    if (!email || !email.trim()) errors.push('Email is required.');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Invalid email format.');
    if (!role) errors.push('Role selection is required.');
    if (!availability) errors.push('Availability is required.');
    if (!startDate) errors.push('Preferred start date is required.');
    if (!pitch || !pitch.trim()) errors.push('Your pitch is required.');
    else if (pitch.length > 500) errors.push('Pitch must be 500 characters or fewer.');

    // Industry-specific validation
    if (req.body.roleTab === 'industry') {
      if (!req.body.companyName || !req.body.companyName.trim()) errors.push('Company name is required.');
      if (!req.body.proposal || !req.body.proposal.trim()) errors.push('Brief project proposal is required.');
      else if (req.body.proposal.length > 800) errors.push('Proposal must be 800 characters or fewer.');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const applications = readApplications();
    const newApp = {
      id: `app-${uuidv4().slice(0, 8)}`,
      projectId: req.body.projectId || null,
      projectTitle: req.body.projectTitle || null,
      name: name.trim(),
      institution: institution.trim(),
      email: email.trim(),
      role,
      roleTab: req.body.roleTab || 'individual',
      orcid: req.body.orcid || null,
      availability,
      startDate,
      pitch: pitch.trim(),
      companyName: req.body.companyName || null,
      website: req.body.website || null,
      proposal: req.body.proposal || null,
      mouInterest: req.body.mouInterest || null,
      submittedAt: new Date().toISOString(),
      reviewed: false
    };

    applications.push(newApp);
    writeApplications(applications);

    // Send email notification (non-blocking — don't fail request if email fails)
    sendApplicationEmail(config.departmentEmail, newApp);

    res.status(201).json({ message: 'Application submitted successfully.', id: newApp.id });
  } catch (err) {
    console.error('Submit application error:', err);
    res.status(500).json({ error: 'Failed to submit application.' });
  }
});

// GET /api/applications — admin only
router.get('/', authMiddleware, (req, res) => {
  try {
    const applications = readApplications();
    res.json(applications);
  } catch (err) {
    console.error('Read applications error:', err);
    res.status(500).json({ error: 'Failed to read applications.' });
  }
});

// PATCH /api/applications/:id — mark reviewed (admin)
router.patch('/:id', authMiddleware, (req, res) => {
  try {
    const applications = readApplications();
    const index = applications.findIndex(a => a.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Application not found.' });
    }
    applications[index] = { ...applications[index], ...req.body };
    writeApplications(applications);
    res.json(applications[index]);
  } catch (err) {
    console.error('Update application error:', err);
    res.status(500).json({ error: 'Failed to update application.' });
  }
});

module.exports = router;
