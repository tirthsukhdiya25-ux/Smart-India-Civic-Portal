import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  MapPin, 
  Filter, 
  RotateCcw, 
  ExternalLink, 
  Calendar, 
  Layers, 
  Navigation,
  CheckCircle,
  Building2,
  Trash2,
  AlertTriangle,
  Waves,
  Droplets,
  Hammer
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CATEGORIES, INDIAN_STATES, MAJOR_CITIES_COORDINATES, STATUS_CONFIG } from '../data/indiaGeoData';
import { StatusBadge } from './StatusBadge';
import { CategoryPill } from './CategoryPill';

// Component to dynamically pan and zoom the map
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

// Function to create custom color-coded map pin
const createCategoryIcon = (categoryName) => {
  const cat = CATEGORIES.find(c => c.name.toLowerCase() === (categoryName || '').toLowerCase()) || CATEGORIES[CATEGORIES.length - 1];
  const color = cat.markerColor || '#f97316';

  const html = `
    <div style="
      position: relative;
      width: 34px;
      height: 34px;
    ">
      <div style="
        width: 32px;
        height: 32px;
        background: ${color};
        border: 2.5px solid #ffffff;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          ●
        </div>
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-map-marker',
    html,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32]
  });
};

export const IndiaMap = ({ 
  complaints = [], 
  height = '620px', 
  showFilters = true,
  initialCenter = [22.9734, 78.6569], // Central India
  initialZoom = 5,
  onSelectComplaint
}) => {
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [mapCenter, setMapCenter] = useState(initialCenter);
  const [mapZoom, setMapZoom] = useState(initialZoom);

  // Filter complaints based on state, city, category, status
  const filteredComplaints = complaints.filter(c => {
    if (selectedState !== 'All' && c.location?.state?.toLowerCase() !== selectedState.toLowerCase()) {
      return false;
    }
    if (selectedCity !== 'All' && c.location?.city?.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }
    if (selectedCategory !== 'All' && c.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (selectedStatus !== 'All' && c.status?.toLowerCase() !== selectedStatus.toLowerCase()) {
      return false;
    }
    return true;
  });

  // Handle City Quick Jump
  const handleCitySelect = (cityName) => {
    setSelectedCity(cityName);
    if (cityName === 'All') {
      setMapCenter(initialCenter);
      setMapZoom(initialZoom);
      return;
    }
    const city = MAJOR_CITIES_COORDINATES.find(c => c.name === cityName);
    if (city) {
      setMapCenter([city.lat, city.lng]);
      setMapZoom(city.zoom || 12);
      setSelectedState(city.state);
    }
  };

  const handleReset = () => {
    setSelectedState('All');
    setSelectedCity('All');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setMapCenter(initialCenter);
    setMapZoom(initialZoom);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-elevated flex flex-col">
      {/* Top Filter and Controls Bar */}
      {showFilters && (
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-saffron-500 text-white rounded-lg shadow-xs">
                <MapPin className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Interactive Civic Map of India
                </h3>
                <p className="text-xs text-slate-500">
                  Showing <span className="font-bold text-saffron-600">{filteredComplaints.length}</span> active complaints across India
                </p>
              </div>
            </div>

            {/* Quick Reset & Jump */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 shadow-xs transition-colors"
                title="Reset view to whole India"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset View</span>
              </button>
            </div>
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Quick City Jump */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Major City Jump
              </label>
              <select
                value={selectedCity}
                onChange={(e) => handleCitySelect(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-saffron-500 focus:outline-none"
              >
                <option value="All">All Major Cities</option>
                {MAJOR_CITIES_COORDINATES.map(c => (
                  <option key={c.name} value={c.name}>{c.name} ({c.state})</option>
                ))}
              </select>
            </div>

            {/* State Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                State / UT
              </label>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedCity('All');
                }}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-saffron-500 focus:outline-none"
              >
                <option value="All">All States / UTs</option>
                {INDIAN_STATES.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Department Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-saffron-500 focus:outline-none"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Complaint Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-saffron-500 focus:outline-none"
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
      )}

      {/* Map Container */}
      <div className="relative w-full" style={{ height }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%', zIndex: 10 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController center={mapCenter} zoom={mapZoom} />

          {/* Complaint Pin Markers */}
          {filteredComplaints.map((comp) => {
            const lat = Number(comp.location?.latitude);
            const lng = Number(comp.location?.longitude);
            if (isNaN(lat) || isNaN(lng)) return null;

            return (
              <Marker
                key={comp.id || comp.complaintId}
                position={[lat, lng]}
                icon={createCategoryIcon(comp.category)}
              >
                <Popup className="civic-popup" maxWidth={320}>
                  <div className="p-1 text-slate-800">
                    {/* Popup Photo */}
                    {comp.imageUrl && (
                      <div className="relative h-32 w-full rounded-lg overflow-hidden mb-2 bg-slate-100">
                        <img
                          src={comp.imageUrl}
                          alt={comp.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1.5 left-1.5 bg-slate-900/80 text-white font-mono text-[10px] px-2 py-0.5 rounded">
                          {comp.complaintId}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <CategoryPill category={comp.category} size="xs" />
                      <StatusBadge status={comp.status} size="sm" />
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-2">
                      {comp.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {comp.description}
                    </p>

                    <div className="mt-2 pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
                      <div className="flex items-start gap-1">
                        <MapPin className="w-3 h-3 text-saffron-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
                          {comp.location?.address}, {comp.location?.city}, {comp.location?.state}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="flex items-center gap-1 text-[10px]">
                          <Calendar className="w-3 h-3" />
                          {new Date(comp.createdAt).toLocaleDateString('en-IN')}
                        </span>

                        <Link
                          to={`/track?id=${comp.complaintId}`}
                          className="inline-flex items-center gap-1 font-bold text-[11px] text-chakra-600 hover:text-chakra-800"
                        >
                          <span>Full Details</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Floating Category Legend on Bottom Right */}
        <div className="absolute bottom-4 right-4 z-[999] bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-elevated hidden sm:block max-w-xs">
          <span className="text-[11px] font-bold text-slate-700 block mb-2 uppercase tracking-wider">
            Marker Category Legend
          </span>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
            {CATEGORIES.slice(0, 6).map(c => (
              <div key={c.id} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: c.markerColor }}
                />
                <span className="truncate text-slate-600">{c.shortName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
