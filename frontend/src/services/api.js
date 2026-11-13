// API service client for Smart India Civic Portal

const API_BASE = '/api';

const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem('smart_india_token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

export const api = {
  // Public Complaint endpoints
  async getComplaints(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val && val !== 'All') query.append(key, val);
    });
    const res = await fetch(`${API_BASE}/complaints?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch complaints');
    return res.json();
  },

  async getStats() {
    const res = await fetch(`${API_BASE}/complaints/stats/summary`);
    if (!res.ok) throw new Error('Failed to fetch statistics');
    return res.json();
  },

  async getComplaintById(id) {
    const res = await fetch(`${API_BASE}/complaints/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Complaint not found');
    }
    return res.json();
  },

  async trackComplaint(complaintId) {
    const res = await fetch(`${API_BASE}/complaints/track/${encodeURIComponent(complaintId.trim())}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Unable to find complaint with given ID');
    }
    return res.json();
  },

  async submitComplaint(formData) {
    const res = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: formData
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to submit complaint');
    }
    return data;
  },

  // Auth endpoints
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }
    return data;
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch user session');
    return res.json();
  },

  async getDemoAccounts() {
    const res = await fetch(`${API_BASE}/auth/demo-accounts`);
    return res.json();
  },

  // Admin endpoints
  async adminGetComplaints(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val && val !== 'All') query.append(key, val);
    });
    const res = await fetch(`${API_BASE}/admin/complaints?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch admin complaints');
    }
    return res.json();
  },

  async adminUpdateStatus(id, payload, isFormData = false) {
    const headers = getAuthHeaders(isFormData);
    const body = isFormData ? payload : JSON.stringify(payload);
    const res = await fetch(`${API_BASE}/admin/complaints/${id}/status`, {
      method: 'PATCH',
      headers,
      body
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update complaint status');
    }
    return data;
  },

  async adminDeleteComplaint(id) {
    const res = await fetch(`${API_BASE}/admin/complaints/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to delete complaint');
    }
    return data;
  }
};
