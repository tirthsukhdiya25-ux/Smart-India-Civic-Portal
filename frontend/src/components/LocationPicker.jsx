import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Loader2, Check, AlertCircle } from 'lucide-react';
import { INDIAN_STATES } from '../data/indiaGeoData';

const pickerPin = L.divIcon({
  className: 'custom-picker-pin',
  html: `
    <div style="
      width: 32px;
      height: 32px;
      background: #ea580c;
      border: 3px solid #ffffff;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 4px 10px rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 10px;
        height: 10px;
        background: white;
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

// Listener to pick position on map click
function ClickHandler({ onLocationChange }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

// Controller to pan map when coordinates change
function PanController({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position && position[0] && position[1]) {
      map.flyTo(position, 15, { duration: 1 });
    }
  }, [position, map]);
  return null;
}

export const LocationPicker = ({ location, setLocation }) => {
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(false);
  const [gpsError, setGpsError] = useState('');

  const currentLat = Number(location.latitude) || 28.6139;
  const currentLng = Number(location.longitude) || 77.2090;

  // Reverse Geocoding helper using OpenStreetMap Nominatim
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, {
        headers: {
          'Accept-Language': 'en'
        }
      });
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        
        const street = addr.road || addr.suburb || addr.neighbourhood || addr.amenity || '';
        const city = addr.city || addr.town || addr.village || addr.county || '';
        const district = addr.state_district || addr.county || city;
        const state = addr.state || '';
        const pincode = addr.postcode || '';

        setLocation(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          address: data.display_name?.split(',').slice(0, 3).join(',') || prev.address || street,
          landmark: prev.landmark || addr.commercial || addr.building || '',
          city: city || prev.city,
          district: district || prev.district,
          state: state || prev.state,
          pincode: pincode || prev.pincode
        }));
      }
    } catch (err) {
      console.warn('Reverse geocode failed, using coordinates only:', err);
    }
  };

  // HTML5 GPS Geolocation handler
  const handleDetectGPS = () => {
    setGpsLoading(true);
    setGpsError('');
    setGpsSuccess(false);

    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));

        setLocation(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng
        }));

        await reverseGeocode(lat, lng);

        setGpsLoading(false);
        setGpsSuccess(true);
        setTimeout(() => setGpsSuccess(false), 4000);
      },
      (err) => {
        setGpsLoading(false);
        let msg = 'Unable to fetch your location.';
        if (err.code === 1) msg = 'Location permission denied. Please allow GPS access in your browser or pick on the map.';
        if (err.code === 2) msg = 'Location position unavailable. Please pick manually on the map.';
        if (err.code === 3) msg = 'Location request timed out. Please try again.';
        setGpsError(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleMapClick = async (lat, lng) => {
    const fixedLat = parseFloat(lat.toFixed(6));
    const fixedLng = parseFloat(lng.toFixed(6));
    setLocation(prev => ({
      ...prev,
      latitude: fixedLat,
      longitude: fixedLng
    }));
    await reverseGeocode(fixedLat, fixedLng);
  };

  return (
    <div className="space-y-4">
      {/* GPS Button and Coordinates Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDetectGPS}
            disabled={gpsLoading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-saffron-500 hover:bg-saffron-600 active:scale-95 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
          >
            {gpsLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : gpsSuccess ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            <span>{gpsLoading ? 'Detecting GPS...' : gpsSuccess ? 'GPS Acquired!' : 'Auto-Detect My GPS Location'}</span>
          </button>

          <span className="text-[11px] text-slate-500 hidden sm:inline">
            (Or click anywhere on the map to place the pin)
          </span>
        </div>

        {/* Coordinates Display */}
        <div className="text-xs font-mono bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 flex items-center justify-between sm:justify-start gap-2">
          <span className="text-slate-400">Coordinates:</span>
          <span className="font-bold text-saffron-700">
            {location.latitude || '28.6139'}, {location.longitude || '77.2090'}
          </span>
        </div>
      </div>

      {gpsError && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Interactive Mini Map Picker */}
      <div className="h-56 w-full rounded-xl overflow-hidden border border-slate-200 shadow-inner relative">
        <MapContainer
          center={[currentLat, currentLng]}
          zoom={14}
          scrollWheelZoom={false}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[currentLat, currentLng]} icon={pickerPin} />
          <ClickHandler onLocationChange={handleMapClick} />
          <PanController position={[currentLat, currentLng]} />
        </MapContainer>
        <div className="absolute bottom-2 left-2 z-[999] bg-white/90 backdrop-blur-xs text-[10px] font-semibold text-slate-700 px-2 py-1 rounded shadow-xs">
          Click map to adjust pin location
        </div>
      </div>

      {/* Manual Address Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Exact Street Address / Location Details <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={location.address}
            onChange={(e) => setLocation(prev => ({ ...prev, address: e.target.value }))}
            placeholder="e.g. Near Bus Stand, Ring Road, Block 4"
            className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Nearby Landmark
          </label>
          <input
            type="text"
            value={location.landmark}
            onChange={(e) => setLocation(prev => ({ ...prev, landmark: e.target.value }))}
            placeholder="e.g. Opposite Post Office / Metro Pillar 124"
            className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            City / Town <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={location.city}
            onChange={(e) => setLocation(prev => ({ ...prev, city: e.target.value }))}
            placeholder="e.g. New Delhi, Mumbai, Bengaluru"
            className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            District
          </label>
          <input
            type="text"
            value={location.district}
            onChange={(e) => setLocation(prev => ({ ...prev, district: e.target.value }))}
            placeholder="e.g. South West Delhi"
            className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            State / Union Territory <span className="text-rose-500">*</span>
          </label>
          <select
            required
            value={location.state}
            onChange={(e) => setLocation(prev => ({ ...prev, state: e.target.value }))}
            className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-none"
          >
            <option value="">Select State / UT</option>
            {INDIAN_STATES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Postal PIN Code <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            maxLength={6}
            pattern="[0-9]{6}"
            value={location.pincode}
            onChange={(e) => setLocation(prev => ({ ...prev, pincode: e.target.value }))}
            placeholder="e.g. 110001"
            className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
