const express = require('express');
const cors = require('cors');
const path = require('path');

const projectsRouter = require('./routes/projects');
const applicationsRouter = require('./routes/applications');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['https://collaboration-portal-frontend.onrender.com', 'http://localhost:5173']
}));
app.use(express.json());

// API Routes
app.use('/api/projects', projectsRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

// Serve frontend build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

module.exports = app;
