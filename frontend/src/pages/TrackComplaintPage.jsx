import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  User, 
  Building2, 
  FileText, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { CategoryPill } from '../components/CategoryPill';
import { TimelineTracker } from '../components/TimelineTracker';
import { api } from '../services/api';

const SAMPLE_IDS = [
  'IND-2026-10482',
  'IND-2026-21894',
  'IND-2026-34901',
  'IND-2026-89102'
];

export const TrackComplaintPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [inputVal, setInputVal] = useState(initialId);
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const performSearch = async (idToSearch) => {
    if (!idToSearch || !idToSearch.trim()) return;
    setLoading(true);
    setError('');
    setComplaint(null);
    try {
      const res = await api.trackComplaint(idToSearch.trim());
      if (res.success && res.complaint) {
        setComplaint(res.complaint);
        setSearchParams({ id: idToSearch.trim() });
      } else {
        setError('No record found for this Complaint ID.');
      }
    } catch (err) {
      setError(err.message || 'Complaint not found. Please verify the ID.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      performSearch(initialId);
    }
  }, [initialId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    performSearch(inputVal);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-saffron-700">
          <Search className="w-3.5 h-3.5" />
          <span>Universal Citizen Redressal Tracker</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Track Public Complaint
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter your unique complaint reference code (e.g. <span className="font-mono font-bold text-slate-700">IND-2026-XXXXX</span>) to view real-time department audit logs and progress.
        </p>
      </div>

      {/* Search Bar Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Enter Complaint ID (e.g. IND-2026-10482)..."
              className="w-full text-xs font-mono pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:outline-none focus:bg-white transition-all uppercase"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-saffron-500 hover:bg-saffron-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Track Progress</span>
          </button>
        </form>

        {/* Quick Sample IDs */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-[11px] text-slate-500">
          <span className="font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Sample IDs to try:</span>
          </span>
          {SAMPLE_IDS.map(sid => (
            <button
              key={sid}
              type="button"
              onClick={() => {
                setInputVal(sid);
                performSearch(sid);
              }}
              className="font-mono font-bold px-2.5 py-1 bg-slate-100 hover:bg-orange-50 hover:text-saffron-700 rounded-md border border-slate-200 transition-colors"
            >
              {sid}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Lookup Error</div>
            <div className="mt-0.5">{error}</div>
          </div>
        </div>
      )}

      {/* Complaint Detail & Status Timeline */}
      {complaint && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Main Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            
            {/* Top Info Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-xs font-bold bg-slate-900 text-white px-3 py-1 rounded-md">
                    {complaint.complaintId}
                  </span>
                  <CategoryPill category={complaint.category} size="sm" />
                </div>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  {complaint.title}
                </h2>
              </div>

              <div className="self-start sm:self-auto">
                <StatusBadge status={complaint.status} size="lg" />
              </div>
            </div>

            {/* Photos & Geographic Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Image Preview */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Reported Problem Photograph
                </span>
                <div className="h-64 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                  <img
                    src={complaint.imageUrl || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"}
                    alt={complaint.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Resolution Proof Photo (If Available) */}
              {complaint.resolutionProofUrl ? (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Official Resolution Proof (Action Completed)</span>
                  </span>
                  <div className="h-64 rounded-xl overflow-hidden bg-slate-100 border-2 border-emerald-300 shadow-inner">
                    <img
                      src={complaint.resolutionProofUrl}
                      alt="Resolution Proof"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                /* Location Details Card */
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Civic Jurisdiction & Coordinates
                    </span>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-saffron-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-slate-800">{complaint.location?.address}</div>
                          {complaint.location?.landmark && (
                            <div className="text-slate-500 text-[11px]">Landmark: {complaint.location.landmark}</div>
                          )}
                          <div className="text-slate-600">
                            {complaint.location?.city}, {complaint.location?.district ? `${complaint.location.district}, ` : ''}{complaint.location?.state} - {complaint.location?.pincode}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 font-mono text-[11px] text-slate-500">
                        <span>GPS: {complaint.location?.latitude}, {complaint.location?.longitude}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400">Assigned Department:</span>
                      <span className="font-bold text-slate-800">{complaint.department}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400">Assigned Field Officer:</span>
                      <span className="font-semibold text-slate-800">{complaint.assignedOfficer || 'Pending Assignment'}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400">Registration Date:</span>
                      <span className="font-medium text-slate-800">{new Date(complaint.createdAt).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Description Text */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Citizen Issue Description
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {complaint.description}
              </p>
            </div>

          </div>

          {/* Stepper Timeline & Audit Log */}
          <TimelineTracker complaint={complaint} />

        </div>
      )}

    </div>
  );
};
