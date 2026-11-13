const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  complaintId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: [
      'Municipal Corporation',
      'Road and Transport Department',
      'Public Works Department (PWD)',
      'Sanitation Department',
      'Water Supply Department',
      'Drainage Department',
      'Other Government Departments'
    ]
  },
  department: { type: String, default: 'Municipal Corporation' },
  status: { 
    type: String, 
    default: 'Submitted',
    enum: [
      'Submitted',
      'Under Review',
      'Assigned to Department',
      'Work in Progress',
      'Resolved',
      'Rejected'
    ]
  },
  assignedOfficer: { type: String, default: 'Unassigned' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  imageUrl: { type: String, default: '' },
  resolutionProofUrl: { type: String, default: '' },
  rejectionReason: { type: String, default: '' },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
    landmark: { type: String, default: '' },
    city: { type: String, required: true },
    district: { type: String, default: '' },
    state: { type: String, required: true },
    pincode: { type: String, default: '' }
  },
  citizen: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' }
  },
  remarks: [
    {
      date: { type: Date, default: Date.now },
      by: { type: String, default: 'System' },
      text: { type: String, required: true }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);
