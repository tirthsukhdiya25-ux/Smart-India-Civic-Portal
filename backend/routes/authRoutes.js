const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const storage = require('../services/storageService');
const { verifyToken, JWT_SECRET } = require('../middleware/auth');

// Register a new citizen account
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, city, state } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const newUser = await storage.createUser({
      name,
      email,
      password,
      phone: phone || '',
      city: city || '',
      state: state || '',
      role: 'citizen'
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: newUser
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Registration failed.' });
  }
});

// Login (Citizen or Admin)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = storage.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await storage.verifyPassword(user, password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || '',
      city: user.city || '',
      state: user.state || '',
      phone: user.phone || ''
    };

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: safeUser
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
});

// Current user profile
router.get('/me', verifyToken, (req, res) => {
  const user = storage.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department || '',
    city: user.city || '',
    state: user.state || '',
    phone: user.phone || ''
  };

  res.json({ success: true, user: safeUser });
});

// Provide demo accounts for seamless test exploration
router.get('/demo-accounts', (req, res) => {
  res.json({
    success: true,
    accounts: [
      {
        role: 'admin',
        title: 'Government Administration Officer',
        email: 'admin@smartindia.gov.in',
        password: 'Admin@123',
        department: 'National Civic Operations Directorate'
      },
      {
        role: 'citizen',
        title: 'Verified Citizen (Amit Sharma)',
        email: 'amit.sharma@example.com',
        password: 'Admin@123',
        city: 'New Delhi'
      }
    ]
  });
});

module.exports = router;
