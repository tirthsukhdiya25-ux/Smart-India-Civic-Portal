import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Wrench, 
  FileText, 
  Save, 
  X, 
  ChevronRight,
  TrendingUp,
  Building2,
  Trash2,
  RefreshCw,
  Camera,
  Layers,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { CategoryPill } from '../components/CategoryPill';
import { CATEGORIES, INDIAN_STATES, STATUS_CONFIG } from '../data/indiaGeoData';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const AdminDashboardPage = () => {
  const { user, isAdmin, loginAsDemo } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected complaint modal for updating status / assigning department
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editOfficer, setEditOfficer] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');
  const [editRemark, setEditRemark] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [resolutionProofFile, setResolutionProofFile] = useState(null);
  const [resolutionProofPreview, setResolutionProofPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [compRes, statsRes] = await Promise.all([
        api.adminGetComplaints().catch(() => api.getComplaints()),
        api.getStats()
      ]);
      if (compRes.success) setComplaints(compRes.complaints);
      if (statsRes.success) setStats(statsRes.stats);
    } catch (err) {
      console.error('Error loading admin complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openComplaintModal = (comp) => {
    setSelectedComplaint(comp);
    setEditStatus(comp.status);
    setEditDepartment(comp.department || comp.category);
    setEditOfficer(comp.assignedOfficer || '');
    setEditPriority(comp.priority || 'Medium');
    setEditRemark('');
    setRejectionReason(comp.rejectionReason || '');
    setResolutionProofFile(null);
    setResolutionProofPreview(comp.resolutionProofUrl || '');
    setSaveMessage('');
  };

  const handleResolutionFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResolutionProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setResolutionProofPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setSaving(true);
    setSaveMessage('');

    try {
      const formData = new FormData();
      formData.append('status', editStatus);
      formData.append('department', editDepartment);
      formData.append('assignedOfficer', editOfficer);
      formData.append('priority', editPriority);
      if (editRemark.trim()) formData.append('remarkNote', editRemark.trim());
      if (editStatus === 'Rejected') {
        formData.append('rejectionReason', rejectionReason);
      }
      if (resolutionProofFile) {
        formData.append('resolutionProof', resolutionProofFile);
      } else if (resolutionProofPreview && !resolutionProofFile) {
        formData.append('resolutionProofUrl', resolutionProofPreview);
      }

      const res = await api.adminUpdateStatus(selectedComplaint.id, formData, true);
      if (res.success) {
        setSaveMessage('Status and department assignment updated successfully!');
        // Update local state
        setComplaints(prev => prev.map(c => c.id === selectedComplaint.id ? res.complaint : c));
        setSelectedComplaint(res.complaint);
        // Refresh stats
        const sRes = await api.getStats();
        if (sRes.success) setStats(sRes.stats);
      }
    } catch (err) {
      alert(err.message || 'Failed to update complaint.');
    } finally {
      setSaving(false);
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter(c => {
    if (statusFilter !== 'All' && c.status?.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    if (categoryFilter !== 'All' && c.category?.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false;
    }
    if (stateFilter !== 'All' && c.location?.state?.toLowerCase() !== stateFilter.toLowerCase()) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      return (
        c.complaintId?.toLowerCase().includes(q) ||
        c.title?.toLowerCase().includes(q) ||
        c.location?.city?.toLowerCase().includes(q) ||
        c.location?.state?.toLowerCase().includes(q) ||
        c.location?.address?.toLowerCase().includes(q) ||
        c.department?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-chakra-900 to-slate-900 p-6 rounded-3xl text-white shadow-elevated">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-saffron-500 rounded-lg text-white">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-saffron-400 uppercase tracking-wider">
              Central Civic Command & Control Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Government Administration Dashboard
          </h1>
          <p className="text-xs text-slate-300">
            Assigned to: <span className="font-bold text-white">{user?.name || 'Dr. Arvind Swaminathan (National Operations)'}</span> • Govt. of India
          </p>
        </div>

        {/* Refresh & Switch */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Feed</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div 
            onClick={() => setStatusFilter('All')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              statusFilter === 'All' ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="text-[11px] font-bold uppercase tracking-wider opacity-70">Total Issues</div>
            <div className="text-2xl font-black mt-1">{stats.total}</div>
          </div>

          <div 
            onClick={() => setStatusFilter('Submitted')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              statusFilter === 'Submitted' ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Submitted</div>
            <div className="text-2xl font-black text-slate-700 mt-1">{stats.submitted}</div>
          </div>

          <div 
            onClick={() => setStatusFilter('Under Review')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              statusFilter === 'Under Review' ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Under Review</div>
            <div className="text-2xl font-black text-blue-700 mt-1">{stats.underReview}</div>
          </div>

          <div 
            onClick={() => setStatusFilter('Work in Progress')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              statusFilter === 'Work in Progress' ? 'bg-amber-600 text-white border-amber-600 shadow-md' : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600">In Progress</div>
            <div className="text-2xl font-black text-amber-700 mt-1">{stats.inProgress + stats.assigned}</div>
          </div>

          <div 
            onClick={() => setStatusFilter('Resolved')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              statusFilter === 'Resolved' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Resolved</div>
            <div className="text-2xl font-black text-emerald-700 mt-1">{stats.resolved}</div>
          </div>

          <div 
            onClick={() => setStatusFilter('Rejected')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              statusFilter === 'Rejected' ? 'bg-rose-600 text-white border-rose-600 shadow-md' : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-rose-600">Rejected</div>
            <div className="text-2xl font-black text-rose-700 mt-1">{stats.rejected}</div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          {/* Search */}
          <div className="relative sm:col-span-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search ID, city, or problem..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-none"
            >
              <option value="All">All Department Categories</option>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* State Filter */}
          <div>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-none"
            >
              <option value="All">All States / UTs</option>
              {INDIAN_STATES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Assigned to Department">Assigned to Department</option>
              <option value="Work in Progress">Work in Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Reported Public Complaints Register ({filteredComplaints.length})
          </h2>
          <span className="text-xs text-slate-500">
            Click any row to assign department & update action status
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Complaint ID</th>
                <th className="py-3 px-4">Problem / Photo</th>
                <th className="py-3 px-4">Category & Department</th>
                <th className="py-3 px-4">Location (City, State)</th>
                <th className="py-3 px-4">Reported By</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((comp) => (
                  <tr
                    key={comp.id || comp.complaintId}
                    onClick={() => openComplaintModal(comp)}
                    className="hover:bg-orange-50/40 cursor-pointer transition-colors"
                  >
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {comp.complaintId}
                    </td>

                    {/* Problem Image & Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <img
                            src={comp.imageUrl || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"}
                            alt={comp.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="max-w-xs">
                          <div className="font-bold text-slate-900 line-clamp-1">{comp.title}</div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{comp.description}</div>
                        </div>
                      </div>
                    </td>

                    {/* Department / Category */}
                    <td className="py-3.5 px-4">
                      <CategoryPill category={comp.category} size="xs" />
                      <div className="text-[11px] text-slate-500 font-semibold mt-1">
                        Dept: {comp.department || comp.category}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="font-semibold text-slate-800">{comp.location?.city}, {comp.location?.state}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[160px]">{comp.location?.address}</div>
                    </td>

                    {/* Citizen */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="font-semibold text-slate-800">{comp.citizen?.name}</div>
                      <div className="text-[11px] text-slate-400">{new Date(comp.createdAt).toLocaleDateString('en-IN')}</div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={comp.status} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openComplaintModal(comp);
                        }}
                        className="px-3 py-1 bg-slate-100 hover:bg-saffron-500 hover:text-white text-slate-700 font-bold rounded-lg transition-colors text-[11px]"
                      >
                        Action / Assign
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-xs">
                    No complaints found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Administrative Action Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2.5 py-0.5 rounded">
                    {selectedComplaint.complaintId}
                  </span>
                  <StatusBadge status={selectedComplaint.status} size="sm" />
                </div>
                <h3 className="font-black text-slate-900 text-lg mt-1">
                  {selectedComplaint.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              
              {saveMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{saveMessage}</span>
                </div>
              )}

              {/* Photo & Location Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Public Issue Photograph</span>
                  <div className="h-44 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={selectedComplaint.imageUrl}
                      alt={selectedComplaint.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">Location Details</span>
                    <p className="font-bold text-slate-800">{selectedComplaint.location?.address}</p>
                    {selectedComplaint.location?.landmark && (
                      <p className="text-slate-500">Landmark: {selectedComplaint.location.landmark}</p>
                    )}
                    <p className="text-slate-600">
                      {selectedComplaint.location?.city}, {selectedComplaint.location?.state} - {selectedComplaint.location?.pincode}
                    </p>
                    <p className="font-mono text-slate-400 text-[10px] mt-1">
                      GPS: {selectedComplaint.location?.latitude}, {selectedComplaint.location?.longitude}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500">
                    Reported by: <strong className="text-slate-700">{selectedComplaint.citizen?.name}</strong> ({selectedComplaint.citizen?.email})
                  </div>
                </div>
              </div>

              {/* Edit Controls Form */}
              <form onSubmit={handleSaveChanges} className="space-y-4 pt-2 border-t border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  
                  {/* Department Assignment */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Assign Government Department
                    </label>
                    <select
                      value={editDepartment}
                      onChange={(e) => setEditDepartment(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-semibold focus:ring-2 focus:ring-saffron-500 focus:outline-none"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status Update */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Update Complaint Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-semibold focus:ring-2 focus:ring-saffron-500 focus:outline-none"
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Assigned to Department">Assigned to Department</option>
                      <option value="Work in Progress">Work in Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Assign Officer / Field Squad */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Assigned Officer / Zonal Engineer
                    </label>
                    <input
                      type="text"
                      value={editOfficer}
                      onChange={(e) => setEditOfficer(e.target.value)}
                      placeholder="e.g. Rajesh Kumar (Executive Engineer, Ward 4)"
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-none"
                    />
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Priority Level
                    </label>
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-semibold focus:ring-2 focus:ring-saffron-500 focus:outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                {/* If Rejected: Mandatory Rejection Reason */}
                {editStatus === 'Rejected' && (
                  <div>
                    <label className="block font-bold text-rose-700 mb-1">
                      Rejection Reason (Required) <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Specify why the complaint is being rejected (e.g., outside municipal jurisdiction, duplicate submission, private land)..."
                      className="w-full p-2 bg-rose-50/50 border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>
                )}

                {/* If Resolved: Upload Resolution Proof Photo */}
                {editStatus === 'Resolved' && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                    <label className="block font-bold text-emerald-800">
                      Upload Resolution Proof Photograph (Before vs After)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleResolutionFileChange}
                      className="text-xs text-slate-600"
                    />
                    {resolutionProofPreview && (
                      <div className="h-28 w-44 rounded-lg overflow-hidden border border-emerald-300 mt-2">
                        <img src={resolutionProofPreview} alt="Proof Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                )}

                {/* Official Remark / Action Update Note */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Add Official Action Remark / Field Log
                  </label>
                  <textarea
                    rows={2}
                    value={editRemark}
                    onChange={(e) => setEditRemark(e.target.value)}
                    placeholder="Enter dispatch notes, contractor assignments, or action completed summary..."
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSelectedComplaint(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-saffron-500 hover:bg-saffron-600 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Updating...' : 'Save & Dispatch Updates'}</span>
                  </button>
                </div>
              </form>

              {/* Action History Log */}
              <div className="pt-4 border-t border-slate-200">
                <span className="font-bold text-slate-500 uppercase text-[10px] block mb-2">Previous Action Audit Log</span>
                <div className="space-y-2">
                  {selectedComplaint.remarks?.map((rem, rIdx) => (
                    <div key={rIdx} className="p-2 bg-slate-50 rounded-lg border border-slate-200/80 text-[11px]">
                      <div className="flex justify-between text-slate-400 font-semibold mb-0.5">
                        <span className="text-slate-700">{rem.by}</span>
                        <span>{new Date(rem.date).toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-slate-600">{rem.text}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
