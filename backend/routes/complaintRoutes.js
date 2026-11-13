const express = require('express');
const router = express.Router();
const storage = require('../services/storageService');
const upload = require('../middleware/upload');
const { optionalAuth, verifyToken } = require('../middleware/auth');

// GET /api/complaints - List complaints with filters
router.get('/', (req, res) => {
  try {
    const { status, category, state, city, citizenEmail, search } = req.query;
    const complaints = storage.getAllComplaints({
      status,
      category,
      state,
      city,
      citizenEmail,
      search
    });

    res.json({
      success: true,
      count: complaints.length,
      complaints
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve complaints.' });
  }
});

// GET /api/complaints/stats/summary - Live complaint counters & breakdown
router.get('/stats/summary', (req, res) => {
  try {
    const stats = storage.getStatsSummary();
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve statistics.' });
  }
});

// GET /api/complaints/track/:complaintId - Track complaint by unique ID
router.get('/track/:complaintId', (req, res) => {
  try {
    const complaint = storage.getComplaintById(req.params.complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `No complaint found with ID "${req.params.complaintId}". Please verify and try again.`
      });
    }

    res.json({
      success: true,
      complaint
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving tracking information.' });
  }
});

// GET /api/complaints/:id - Single complaint detail
router.get('/:id', (req, res) => {
  try {
    const complaint = storage.getComplaintById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }
    res.json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving complaint.' });
  }
});

// POST /api/complaints - Submit a public civic problem report
router.post('/', optionalAuth, upload.single('image'), (req, res) => {
  try {
    const {
      title,
      description,
      category,
      latitude,
      longitude,
      address,
      landmark,
      city,
      district,
      state,
      pincode,
      citizenName,
      citizenEmail,
      citizenPhone,
      imageUrl: directImageUrl
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and problem category are required.'
      });
    }

    // Determine final image URL
    let finalImageUrl = directImageUrl || '';
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    // Citizen details from auth or form body
    const citizen = {
      name: (req.user && req.user.name) || citizenName || 'Citizen of India',
      email: (req.user && req.user.email) || citizenEmail || 'anonymous.citizen@smartindia.gov.in',
      phone: citizenPhone || ''
    };

    const newComplaint = storage.createComplaint({
      title,
      description,
      category,
      department: category, // initially matches category
      imageUrl: finalImageUrl,
      location: {
        latitude: parseFloat(latitude) || 20.5937,
        longitude: parseFloat(longitude) || 78.9629,
        address: address || 'Reported Location',
        landmark: landmark || '',
        city: city || 'Unknown City',
        district: district || city || '',
        state: state || 'Unknown State',
        pincode: pincode || ''
      },
      citizen
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully! Your unique tracking ID is ' + newComplaint.complaintId,
      complaint: newComplaint
    });
  } catch (err) {
    console.error('Error submitting complaint:', err);
    res.status(500).json({ success: false, message: 'Failed to submit complaint. ' + err.message });
  }
});

module.exports = router;
