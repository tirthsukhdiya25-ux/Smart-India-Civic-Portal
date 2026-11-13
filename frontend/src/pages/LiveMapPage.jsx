import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Filter, 
  Layers, 
  Navigation, 
  ArrowRight,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { IndiaMap } from '../components/IndiaMap';
import { CategoryPill } from '../components/CategoryPill';
import { StatusBadge } from '../components/StatusBadge';
import { CATEGORIES, INDIAN_STATES, MAJOR_CITIES_COORDINATES } from '../data/indiaGeoData';
import { api } from '../services/api';

export const LiveMapPage = () => {
  const [searchParams] = useSearchParams();
  const initialCategoryParam = searchParams.get('category') || 'All';

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryParam);
  const [selectedState, setSelectedState] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeComplaint, setActiveComplaint] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.getComplaints();
        if (res.success) {
          setComplaints(res.complaints);
        }
      } catch (err) {
        console.error('Failed to load complaints for map:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  // Filter for side list
  const filteredList = complaints.filter(c => {
    if (selectedCategory !== 'All' && c.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (selectedState !== 'All' && c.location?.state?.toLowerCase() !== selectedState.toLowerCase()) {
      return false;
    }
    if (selectedStatus !== 'All' && c.status?.toLowerCase() !== selectedStatus.toLowerCase()) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.complaintId?.toLowerCase().includes(q) ||
        c.title?.toLowerCase().includes(q) ||
        c.location?.city?.toLowerCase().includes(q) ||
        c.location?.state?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-saffron-600 uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>National Geospatial Feed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            India Civic Grievance Heatmap & Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore reported civic issues across all Indian states and municipalities in real-time.
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center gap-2 px-4 py-2 bg-saffron-500 hover:bg-saffron-600 text-white font-bold text-xs rounded-xl shadow-xs self-start sm:self-auto transition-colors"
        >
          <span>+ Report New Issue</span>
        </Link>
      </div>

      {/* Main Grid: Left Map, Right List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: The Interactive Map */}
        <div className="lg:col-span-2 space-y-4">
          <IndiaMap
            complaints={complaints}
            height="640px"
            showFilters={true}
            onSelectComplaint={setActiveComplaint}
          />
        </div>

        {/* Right 1 Col: Search & Filterable Complaint List */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col h-[740px]">
          {/* Header of sidebar */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Grievances Feed ({filteredList.length})
              </h3>
              {(selectedCategory !== 'All' || selectedState !== 'All' || selectedStatus !== 'All' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedState('All');
                    setSelectedStatus('All');
                    setSearchQuery('');
                  }}
                  className="text-[11px] text-saffron-600 hover:underline font-semibold"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by ID, city, or problem..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-none"
              />
            </div>
          </div>

          {/* List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
            {filteredList.length > 0 ? (
              filteredList.map((comp) => (
                <div
                  key={comp.id || comp.complaintId}
                  className="p-3 rounded-xl hover:bg-slate-50 transition-colors space-y-2 border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {comp.complaintId}
                    </span>
                    <StatusBadge status={comp.status} size="sm" />
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                    {comp.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {comp.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-slate-400 truncate max-w-[160px]">
                      📍 {comp.location?.city}, {comp.location?.state}
                    </span>

                    <Link
                      to={`/track?id=${comp.complaintId}`}
                      className="text-chakra-600 hover:text-chakra-800 font-bold inline-flex items-center gap-0.5"
                    >
                      <span>Track</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No complaints match the selected filter criteria.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
