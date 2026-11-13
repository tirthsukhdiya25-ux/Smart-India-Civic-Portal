import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  Camera, 
  ArrowRight, 
  Sparkles,
  Building,
  TrendingUp,
  AlertTriangle,
  Award
} from 'lucide-react';
import { IndiaMap } from '../components/IndiaMap';
import { ComplaintCard } from '../components/ComplaintCard';
import { CategoryPill } from '../components/CategoryPill';
import { StatusBadge } from '../components/StatusBadge';
import { CATEGORIES } from '../data/indiaGeoData';
import { api } from '../services/api';

export const HomePage = () => {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [complaintsRes, statsRes] = await Promise.all([
          api.getComplaints(),
          api.getStats()
        ]);
        if (complaintsRes.success) setComplaints(complaintsRes.complaints);
        if (statsRes.success) setStats(statsRes.stats);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const recentlyReported = complaints.slice(0, 6);
  const recentlyResolved = complaints.filter(c => c.status === 'Resolved').slice(0, 2);

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/60 via-white to-slate-50 pt-12 pb-16 border-b border-slate-200">
        {/* Subtle Decorative Backdrop Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-saffron-100/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* National Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-saffron-200 shadow-xs text-xs font-bold text-saffron-700">
              <span className="w-2 h-2 rounded-full bg-saffron-500 animate-ping" />
              <span>National Civic Redressal Portal • Digital India</span>
            </div>

            {/* Main Heading & Tagline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Your City, Your Voice, <br />
              <span className="bg-gradient-to-r from-saffron-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                Better India.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Report Public Problems. Help Build a Cleaner and Better India. Connect directly with municipal bodies, PWD, and sanitation departments with geo-tagged photographic evidence.
            </p>

            {/* Main Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link
                to="/report"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-saffron-500 to-orange-600 hover:from-saffron-600 hover:to-orange-700 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-500/20 active:scale-95 transition-all"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Report a Public Problem</span>
              </Link>

              <Link
                to="/track"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md active:scale-95 transition-all"
              >
                <Search className="w-5 h-5 text-saffron-400" />
                <span>Track Complaint by ID</span>
              </Link>

              <Link
                to="/map"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 shadow-xs active:scale-95 transition-all"
              >
                <MapPin className="w-5 h-5 text-saffron-600" />
                <span>View India Map</span>
              </Link>
            </div>

            {/* Quick Live Stats Pills */}
            {stats && (
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
                <div className="bg-white/90 backdrop-blur-xs p-3 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-xl font-black text-slate-900">{stats.total}</div>
                  <div className="text-[11px] font-semibold text-slate-500">Total Reported</div>
                </div>
                <div className="bg-white/90 backdrop-blur-xs p-3 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-xl font-black text-emerald-600">{stats.resolved}</div>
                  <div className="text-[11px] font-semibold text-slate-500">Resolved Issues</div>
                </div>
                <div className="bg-white/90 backdrop-blur-xs p-3 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-xl font-black text-amber-600">{stats.inProgress + stats.assigned}</div>
                  <div className="text-[11px] font-semibold text-slate-500">Work in Action</div>
                </div>
                <div className="bg-white/90 backdrop-blur-xs p-3 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-xl font-black text-chakra-600">{stats.resolutionRate}%</div>
                  <div className="text-[11px] font-semibold text-slate-500">Resolution Rate</div>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Main Interactive Visual Element: India Map Integration */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-600 uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              <span>Real-Time Geographic Visualizer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Live Civic Issue Map of India
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pinpointed citizen grievances mapped across states and municipal wards with color-coded categories.
            </p>
          </div>

          <Link
            to="/map"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-chakra-700 hover:text-chakra-900 bg-chakra-50 px-3.5 py-2 rounded-lg border border-chakra-200 self-start md:self-auto transition-colors"
          >
            <span>Full-Screen Map View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Embedded Map Component */}
        <IndiaMap complaints={complaints} height="560px" showFilters={true} />
      </section>

      {/* 3-Step Civic Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-saffron-600 uppercase tracking-wider">Fast & Transparent</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">How Citizens Redress Problems</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">From capturing photo evidence on the street to verified resolution by field officers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-saffron-600 flex items-center justify-center font-bold text-lg mb-4">
                <Camera className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase">Step 01</span>
              <h3 className="text-base font-bold text-slate-900 mt-1">Snap & Auto-Pin Location</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Take a quick photo of the pothole, garbage dump, or broken pipeline. Our portal captures high-precision GPS coordinates automatically.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-saffron-600">
              Instant Unique ID Generated
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-chakra-600 flex items-center justify-center font-bold text-lg mb-4">
                <Building className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase">Step 02</span>
              <h3 className="text-base font-bold text-slate-900 mt-1">Government Department Action</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Complaint is routed to the respective civic department (Sanitation, PWD, Municipal, Water) and assigned to a zonal field executive engineer.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-chakra-600">
              Official Remarks & Squad Assigned
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase">Step 03</span>
              <h3 className="text-base font-bold text-slate-900 mt-1">Track to Verified Resolution</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Track status in real-time. Once the repair or cleanup is completed, official resolution proof photographs are uploaded for public accountability.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-emerald-600">
              Public Before & After Verification
            </div>
          </div>
        </div>
      </section>

      {/* Recently Reported Problems Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-saffron-600 uppercase tracking-wider">Citizen Submissions</span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">Recently Reported Public Problems</h2>
            <p className="text-xs text-slate-500">Live citizen grievance feed across Indian cities.</p>
          </div>

          <Link
            to="/report"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-700 hover:text-saffron-800 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200 transition-colors self-start sm:self-auto"
          >
            <span>+ Report An Issue</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentlyReported.map((comp) => (
            <ComplaintCard key={comp.id || comp.complaintId} complaint={comp} />
          ))}
        </div>
      </section>

      {/* Recently Resolved Complaints Spotlight (Before vs After) */}
      {recentlyResolved.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Civic Success Stories</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Recently Resolved Complaints
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1">
                Transparency in governance: Citizen reports inspected, action taken by civic authorities, and verified with photographic evidence.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {recentlyResolved.map(res => (
                  <div key={res.id} className="bg-slate-800/80 rounded-2xl border border-slate-700 p-5 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800">
                        {res.complaintId}
                      </span>
                      <StatusBadge status="Resolved" size="sm" />
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-white">{res.title}</h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{res.description}</p>
                    </div>

                    {/* Before & After Photo Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-rose-400 block">Reported Problem</span>
                        <div className="h-32 rounded-lg overflow-hidden bg-slate-900 border border-slate-700">
                          <img src={res.imageUrl} alt="Problem" className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-emerald-400 block">Action Completed</span>
                        <div className="h-32 rounded-lg overflow-hidden bg-slate-900 border border-slate-700">
                          <img src={res.resolutionProofUrl || res.imageUrl} alt="Resolved" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                      <span>{res.location?.city}, {res.location?.state}</span>
                      <Link to={`/track?id=${res.complaintId}`} className="text-emerald-400 hover:underline font-semibold">
                        View Full Audit Log →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Government Department Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-saffron-600 uppercase tracking-wider">Public Departments</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Responsible Civic Authorities</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Issues are automatically categorized and routed to specialized authorities.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.id}
              to={`/map?category=${encodeURIComponent(cat.id)}`}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-saffron-300 hover:shadow-elevated transition-all flex items-start gap-4 group"
            >
              <div 
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${cat.markerColor}15`, color: cat.markerColor }}
              >
                <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: cat.markerColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-saffron-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-chakra-600 mt-2.5">
                  <span>Explore on Map</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
};
