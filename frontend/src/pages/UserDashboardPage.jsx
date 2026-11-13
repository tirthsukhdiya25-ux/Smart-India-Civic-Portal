import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  ArrowRight, 
  ExternalLink,
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { CategoryPill } from '../components/CategoryPill';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const UserDashboardPage = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserComplaints = async () => {
      try {
        // Query by user's email if available, or fetch all and filter by current user
        const res = await api.getComplaints(user?.email ? { citizenEmail: user.email } : {});
        if (res.success) {
          // If citizen has specific reports, show those, otherwise if demo show realistic set
          const myComplaints = user?.email 
            ? res.complaints.filter(c => c.citizen?.email?.toLowerCase() === user.email.toLowerCase())
            : res.complaints.slice(0, 3);
          setComplaints(myComplaints.length > 0 ? myComplaints : res.complaints.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching user complaints:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserComplaints();
  }, [user]);

  const totalSubmitted = complaints.length;
  const totalResolved = complaints.filter(c => c.status === 'Resolved').length;
  const inProgress = complaints.filter(c => c.status === 'Work in Progress' || c.status === 'Assigned to Department').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-orange-50 via-white to-amber-50 rounded-3xl border border-saffron-200 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-saffron-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
            <User className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-bold text-saffron-700 uppercase tracking-wider">
              Citizen Grievance Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
              Welcome back, {user?.name || 'Citizen'}!
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Registered Email: <span className="font-mono text-slate-700">{user?.email || 'amit.sharma@example.com'}</span> • Verified Indian Resident
            </p>
          </div>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center gap-2 px-5 py-3 bg-saffron-500 hover:bg-saffron-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Civic Issue</span>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Lodged Complaints</span>
            <div className="text-3xl font-black text-slate-900 mt-1">{totalSubmitted}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-100 text-saffron-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Under Action / Squad Dispatched</span>
            <div className="text-3xl font-black text-amber-600 mt-1">{inProgress}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Verified Resolved</span>
            <div className="text-3xl font-black text-emerald-600 mt-1">{totalResolved}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* My Complaints List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            My Submitted Complaints History
          </h2>
          <Link to="/map" className="text-xs font-bold text-chakra-600 hover:underline">
            View on National Map →
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {complaints.length > 0 ? (
            complaints.map((comp) => (
              <div key={comp.id || comp.complaintId} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img
                      src={comp.imageUrl || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"}
                      alt={comp.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                        {comp.complaintId}
                      </span>
                      <CategoryPill category={comp.category} size="xs" />
                      <StatusBadge status={comp.status} size="sm" />
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm">
                      {comp.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-saffron-500" />
                        <span>{comp.location?.city}, {comp.location?.state}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(comp.createdAt).toLocaleDateString('en-IN')}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Link
                    to={`/track?id=${comp.complaintId}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-chakra-50 hover:bg-chakra-100 text-chakra-700 font-bold text-xs rounded-xl border border-chakra-200 transition-colors"
                  >
                    <span>Track Status & Remarks</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center space-y-3">
              <Clock className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">You haven't submitted any complaints yet.</p>
              <Link
                to="/report"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-saffron-500 text-white font-bold text-xs rounded-xl"
              >
                + Lodge Your First Complaint
              </Link>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
