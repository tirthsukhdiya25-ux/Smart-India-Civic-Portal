const express = require('express');
const router = express.Router();
const storage = require('../services/storageService');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Protect all admin routes
router.use(verifyToken);
router.use(requireAdmin);

// GET /api/admin/complaints
router.get('/complaints', (req, res) => {
  try {
    const { status, category, state, city, search } = req.query;
    const complaints = storage.getAllComplaints({
      status,
      category,
      state,
      city,
      search
    });

    res.json({
      success: true,
      count: complaints.length,
      complaints
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve administrative complaint list.' });
  }
});

// PATCH /api/admin/complaints/:id/status - Update status, assign department, add remarks
router.patch('/complaints/:id/status', upload.single('resolutionProof'), (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      department,
      assignedOfficer,
      priority,
      remarkNote,
      rejectionReason,
      resolutionProofUrl: directProofUrl
    } = req.body;

    const existing = storage.getComplaintById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    if (status === 'Rejected' && !rejectionReason && !existing.rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is mandatory when marking a complaint as Rejected.'
      });
    }

    let resolutionProofUrl = existing.resolutionProofUrl;
    if (req.file) {
      resolutionProofUrl = `/uploads/${req.file.filename}`;
    } else if (directProofUrl) {
      resolutionProofUrl = directProofUrl;
    }

    const updated = storage.updateComplaint(id, {
      status,
      department,
      assignedOfficer,
      priority,
      remarkNote,
      rejectionReason: status === 'Rejected' ? rejectionReason : existing.rejectionReason,
      resolutionProofUrl,
      updatedBy: `${req.user.name} (${req.user.department || 'Gov Administration'})`
    });

    res.json({
      success: true,
      message: `Complaint ${updated.complaintId} updated successfully.`,
      complaint: updated
    });
  } catch (err) {
    console.error('Error updating complaint status:', err);
    res.status(500).json({ success: false, message: 'Failed to update complaint status.' });
  }
});

// DELETE /api/admin/complaints/:id
router.delete('/complaints/:id', (req, res) => {
  try {
    const { id } = req.params;
    const success = storage.deleteComplaint(id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }
    res.json({ success: true, message: 'Complaint removed successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete complaint.' });
  }
});

module.exports = router;
