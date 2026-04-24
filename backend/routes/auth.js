const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const config = require('../data/config.json');

const router = express.Router();
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, department, roleTitle } = req.body;
    
    if (!name || !email || !password || !department) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const users = readUsers();
    if (users.find(u => u.email === email) || email === config.adminEmail) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: `user-${uuidv4().slice(0, 8)}`,
      name,
      email,
      passwordHash,
      department,
      roleTitle,
      role: 'user',
      approvalStatus: 'pending',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsers(users);

    res.status(201).json({ message: 'Registration submitted. Awaiting admin approval.' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to register.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // 1. Check Admin
    if (email === config.adminEmail) {
      const isValid = await bcrypt.compare(password, config.adminPasswordHash);
      if (!isValid) return res.status(401).json({ error: 'Invalid credentials.' });

      const token = jwt.sign({ email, role: 'admin' }, config.jwtSecret, { expiresIn: '8h' });
      return res.json({ token, email, role: 'admin' });
    }

    // 2. Check Researcher
    const users = readUsers();
    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials.' });

    if (user.approvalStatus !== 'approved') {
      return res.status(403).json({ error: 'Account pending approval. Please contact the department admin.' });
    }

    const token = jwt.sign({ id: user.id, email, role: 'user' }, config.jwtSecret, { expiresIn: '8h' });
    res.json({ token, email, role: 'user', name: user.name });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
