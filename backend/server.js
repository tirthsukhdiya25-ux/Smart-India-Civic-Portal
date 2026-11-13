const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

const fs = require('fs');

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend production build if dist exists
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
}

// Attempt MongoDB connection if configured
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_india_civic';
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 2000
}).then(() => {
  console.log('✅ Connected to MongoDB at ' + MONGODB_URI);
}).catch((err) => {
  console.log('ℹ️  MongoDB not running or unreachable (' + err.message + ').');
  console.log('⚡ Active Storage Engine: Resilient Local JSON Database (backend/data/db.json). Ready for all operations!');
});

// Import route modules
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);

// System health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    project: 'Smart India – Civic Issue Reporting & Government Action Portal',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Frontend SPA wildcard fallback
if (fs.existsSync(frontendDistPath)) {
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(frontendDistPath, 'index.html'));
    } else {
      res.status(404).json({ success: false, message: 'API route not found' });
    }
  });
} else {
  // Root welcome if no frontend build yet
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to Smart India Civic API',
      documentation: '/api/complaints, /api/auth, /api/admin, /api/health'
    });
  });
}

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.'
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🇮🇳 Smart India Civic Portal Backend running on port ${PORT}`);
  console.log(`🌐 Base API URL: http://localhost:${PORT}/api`);
  console.log(`=======================================================`);
});
