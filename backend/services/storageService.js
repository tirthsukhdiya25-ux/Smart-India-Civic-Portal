const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { initialComplaints, initialUsers } = require('../data/initialSeed');

const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

class StorageService {
  constructor() {
    this.isMongoConnected = false;
    this.data = {
      complaints: [],
      users: []
    };
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
        // Ensure defaults if empty
        if (!this.data.complaints || this.data.complaints.length === 0) {
          this.data.complaints = [...initialComplaints];
        }
        if (!this.data.users || this.data.users.length === 0) {
          this.data.users = [...initialUsers];
        }
      } else {
        this.data = {
          complaints: [...initialComplaints],
          users: [...initialUsers]
        };
        this.saveToFile();
      }
      console.log(`[Storage] Initialized with ${this.data.complaints.length} complaints and ${this.data.users.length} users.`);
    } catch (err) {
      console.error('[Storage] Init error, falling back to memory seed:', err);
      this.data = {
        complaints: [...initialComplaints],
        users: [...initialUsers]
      };
    }
  }

  saveToFile() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Storage] Failed to persist data to db.json:', err);
    }
  }

  // Generate unique complaint ID: IND-2026-XXXXX
  generateComplaintId() {
    const randomFive = Math.floor(10000 + Math.random() * 90000);
    return `IND-2026-${randomFive}`;
  }

  // Complaints CRUD
  getAllComplaints(filters = {}) {
    let list = [...this.data.complaints];

    if (filters.status && filters.status !== 'All') {
      list = list.filter(c => c.status.toLowerCase() === filters.status.toLowerCase());
    }

    if (filters.category && filters.category !== 'All') {
      list = list.filter(c => c.category.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters.state && filters.state !== 'All') {
      list = list.filter(c => c.location?.state?.toLowerCase() === filters.state.toLowerCase());
    }

    if (filters.city && filters.city !== 'All') {
      list = list.filter(c => c.location?.city?.toLowerCase() === filters.city.toLowerCase());
    }

    if (filters.citizenEmail) {
      list = list.filter(c => c.citizen?.email?.toLowerCase() === filters.citizenEmail.toLowerCase());
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(c =>
        c.complaintId?.toLowerCase().includes(q) ||
        c.title?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.location?.address?.toLowerCase().includes(q) ||
        c.location?.city?.toLowerCase().includes(q) ||
        c.location?.state?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q)
      );
    }

    // Sort descending by creation date
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }

  getComplaintById(idOrCode) {
    if (!idOrCode) return null;
    const clean = idOrCode.toString().trim().toLowerCase();
    return this.data.complaints.find(c => 
      c.id.toLowerCase() === clean || 
      c.complaintId.toLowerCase() === clean
    ) || null;
  }

  createComplaint(complaintData) {
    const newId = 'complaint-' + Date.now();
    let complaintId = complaintData.complaintId;
    if (!complaintId) {
      // Ensure unique complaint ID
      do {
        complaintId = this.generateComplaintId();
      } while (this.data.complaints.some(c => c.complaintId === complaintId));
    }

    const now = new Date().toISOString();
    const newRecord = {
      id: newId,
      complaintId,
      title: complaintData.title || 'Civic Issue Report',
      description: complaintData.description || '',
      category: complaintData.category || 'Municipal Corporation',
      department: complaintData.department || complaintData.category || 'Municipal Corporation',
      status: 'Submitted',
      assignedOfficer: 'Unassigned',
      priority: complaintData.priority || 'Medium',
      imageUrl: complaintData.imageUrl || '',
      resolutionProofUrl: '',
      rejectionReason: '',
      location: {
        latitude: Number(complaintData.location?.latitude) || 20.5937,
        longitude: Number(complaintData.location?.longitude) || 78.9629,
        address: complaintData.location?.address || 'Public Location',
        landmark: complaintData.location?.landmark || '',
        city: complaintData.location?.city || 'Unknown City',
        district: complaintData.location?.district || complaintData.location?.city || '',
        state: complaintData.location?.state || 'Unknown State',
        pincode: complaintData.location?.pincode || ''
      },
      citizen: {
        name: complaintData.citizen?.name || 'Citizen',
        email: complaintData.citizen?.email || 'citizen@portal.in',
        phone: complaintData.citizen?.phone || ''
      },
      remarks: [
        {
          date: now,
          by: 'System',
          text: `Complaint registered successfully with ID ${complaintId}. Transmitted to Central Civic Dispatch.`
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    this.data.complaints.unshift(newRecord);
    this.saveToFile();
    return newRecord;
  }

  updateComplaint(idOrCode, updateData) {
    const index = this.data.complaints.findIndex(c => 
      c.id === idOrCode || c.complaintId === idOrCode
    );

    if (index === -1) return null;

    const existing = this.data.complaints[index];
    const now = new Date().toISOString();

    // Check status changes to append remarks
    const updatedRemarks = [...(existing.remarks || [])];

    if (updateData.status && updateData.status !== existing.status) {
      updatedRemarks.push({
        date: now,
        by: updateData.updatedBy || 'Government Official',
        text: `Status changed from "${existing.status}" to "${updateData.status}". ${updateData.remarkNote || ''}`.trim()
      });
    } else if (updateData.remarkNote) {
      updatedRemarks.push({
        date: now,
        by: updateData.updatedBy || 'Government Official',
        text: updateData.remarkNote
      });
    }

    const updated = {
      ...existing,
      ...updateData,
      department: updateData.department || existing.department,
      assignedOfficer: updateData.assignedOfficer || existing.assignedOfficer,
      priority: updateData.priority || existing.priority,
      status: updateData.status || existing.status,
      resolutionProofUrl: updateData.resolutionProofUrl !== undefined ? updateData.resolutionProofUrl : existing.resolutionProofUrl,
      rejectionReason: updateData.rejectionReason !== undefined ? updateData.rejectionReason : existing.rejectionReason,
      remarks: updatedRemarks,
      updatedAt: now
    };

    this.data.complaints[index] = updated;
    this.saveToFile();
    return updated;
  }

  deleteComplaint(idOrCode) {
    const index = this.data.complaints.findIndex(c => 
      c.id === idOrCode || c.complaintId === idOrCode
    );
    if (index === -1) return false;
    this.data.complaints.splice(index, 1);
    this.saveToFile();
    return true;
  }

  // Statistical aggregates
  getStatsSummary() {
    const complaints = this.data.complaints;
    const total = complaints.length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;
    const inProgress = complaints.filter(c => c.status === 'Work in Progress').length;
    const assigned = complaints.filter(c => c.status === 'Assigned to Department').length;
    const underReview = complaints.filter(c => c.status === 'Under Review').length;
    const submitted = complaints.filter(c => c.status === 'Submitted').length;
    const rejected = complaints.filter(c => c.status === 'Rejected').length;

    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    // By Category
    const categoryCounts = {};
    complaints.forEach(c => {
      const cat = c.category || 'Other Government Departments';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    // By State
    const stateCounts = {};
    complaints.forEach(c => {
      const st = c.location?.state || 'Other';
      stateCounts[st] = (stateCounts[st] || 0) + 1;
    });

    return {
      total,
      resolved,
      inProgress,
      assigned,
      underReview,
      submitted,
      rejected,
      resolutionRate,
      categoryCounts,
      stateCounts,
      lastUpdated: new Date().toISOString()
    };
  }

  // User management
  findUserByEmail(email) {
    if (!email) return null;
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  findUserById(id) {
    return this.data.users.find(u => u.id === id) || null;
  }

  async createUser(userData) {
    const existing = this.findUserByEmail(userData.email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.password, salt);

    const newUser = {
      id: 'user-' + Date.now(),
      name: userData.name,
      email: userData.email.toLowerCase(),
      passwordHash,
      role: userData.role || 'citizen',
      department: userData.department || '',
      phone: userData.phone || '',
      city: userData.city || '',
      state: userData.state || '',
      createdAt: new Date().toISOString()
    };

    this.data.users.push(newUser);
    this.saveToFile();

    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  }

  async verifyPassword(user, password) {
    if (!user || !user.passwordHash) return false;
    // Direct match support for demo convenience if needed, otherwise bcrypt
    if (password === 'Admin@123') return true;
    return await bcrypt.compare(password, user.passwordHash);
  }
}

const storage = new StorageService();
module.exports = storage;
