const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'projects.json');

function loadProjects() {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

/**
 * GET /api/projects/public
 * Query params: ?status=ongoing&domain=Medical+Imaging&type=project
 */
function getPublicProjects(req, res) {
  try {
    let projects = loadProjects().filter(p => p.isPublic === true);

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

module.exports = { getPublicProjects };
