const jwt = require('jsonwebtoken');
const storage = require('../services/storageService');

const JWT_SECRET = process.env.JWT_SECRET || 'smart-india-secret-civic-key-2026';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = storage.findUserById(decoded.id) || storage.findUserByEmail(decoded.email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid session or user not found.' });
    }
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department
    };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Session expired or invalid token.' });
  }
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    req.user = null;
    return next();
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = storage.findUserById(decoded.id) || storage.findUserByEmail(decoded.email);
    if (user) {
      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      };
    }
  } catch (err) {
    req.user = null;
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Administrator privileges required.' });
  }
  next();
};

module.exports = { verifyToken, optionalAuth, requireAdmin, JWT_SECRET };
