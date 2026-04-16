const express = require('express');
const cors = require('cors');

const projectRoutes = require('./routes/projectRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ──
app.use(cors());
app.use(express.json());

// ── API Routes ──
app.use('/api/projects', projectRoutes);

// ── Health check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'KMC FYRC Portal API running' });
});

app.listen(PORT, () => {
  console.log(`✅  FYRC Portal API  →  http://localhost:${PORT}`);
});

module.exports = app;
