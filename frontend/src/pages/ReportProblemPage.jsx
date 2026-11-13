import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Camera, 
  Upload, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Send
} from 'lucide-react';
import { LocationPicker } from '../components/LocationPicker';
import { CATEGORIES, SAMPLE_ISSUE_PHOTOS } from '../data/indiaGeoData';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const ReportProblemPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [description, setDescription] = useState('');
  
  // Image State
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [sampleImageUrl, setSampleImageUrl] = useState('');

  // Location State
  const [location, setLocation] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    address: '',
    landmark: '',
    city: 'New Delhi',
    district: 'New Delhi',
    state: 'Delhi',
    pincode: '110001'
  });

  // Citizen State
  const [citizenName, setCitizenName] = useState(user?.name || '');
  const [citizenEmail, setCitizenEmail] = useState(user?.email || '');
  const [citizenPhone, setCitizenPhone] = useState(user?.phone || '');

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedComplaint, setSubmittedComplaint] = useState(null);

  // Handle local file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setSampleImageUrl('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle sample photo select
  const handleSelectSample = (sample) => {
    setSelectedFile(null);
    setSampleImageUrl(sample.url);
    setImagePreview(sample.url);
    setCategory(sample.category);
    if (!title) {
      setTitle(sample.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a complaint title.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a short description of the issue.');
      return;
    }
    if (!imagePreview && !selectedFile && !sampleImageUrl) {
      setError('Please upload or capture a photo of the public problem.');
      return;
    }
    if (!location.address.trim()) {
      setError('Please provide a street address or location description.');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('category', category);
      formData.append('description', description.trim());
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
      formData.append('address', location.address);
      formData.append('landmark', location.landmark);
      formData.append('city', location.city);
      formData.append('district', location.district);
      formData.append('state', location.state);
      formData.append('pincode', location.pincode);
      formData.append('citizenName', citizenName || 'Citizen of India');
      formData.append('citizenEmail', citizenEmail || 'anonymous@smartindia.gov.in');
      formData.append('citizenPhone', citizenPhone || '');

      if (selectedFile) {
        formData.append('image', selectedFile);
      } else if (sampleImageUrl) {
        formData.append('imageUrl', sampleImageUrl);
      }

      const res = await api.submitComplaint(formData);
      if (res.success && res.complaint) {
        setSubmittedComplaint(res.complaint);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Success Modal / Banner */}
      {submittedComplaint ? (
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 shadow-xl text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Grievance Registered Successfully
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Thank You for Your Civic Vigilance!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
              Your report has been received and routed to the <strong className="text-slate-800">{submittedComplaint.category}</strong>. A field team has been notified.
            </p>
          </div>

          {/* Unique ID Badge */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-sm mx-auto">
            <div className="text-xs text-slate-400 font-medium">Your Unique Complaint ID:</div>
            <div className="font-mono text-2xl font-black text-saffron-600 tracking-wider mt-0.5">
              {submittedComplaint.complaintId}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Save this ID to check action updates anytime.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to={`/track?id=${submittedComplaint.complaintId}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-chakra-700 hover:bg-chakra-800 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              <span>Track This Complaint Live</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/map"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors"
            >
              <span>Locate on India Map</span>
            </Link>

            <button
              onClick={() => {
                setSubmittedComplaint(null);
                setTitle('');
                setDescription('');
                setSelectedFile(null);
                setImagePreview('');
                setSampleImageUrl('');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-saffron-600 hover:underline font-bold text-xs"
            >
              Report Another Problem
            </button>
          </div>
        </div>
      ) : (

        /* The Main Complaint Submission Form */
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Header */}
          <div className="border-b border-slate-200 pb-5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-600 uppercase tracking-wider mb-1">
              <Camera className="w-3.5 h-3.5" />
              <span>Public Civic Grievance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Report a Public Problem
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Help your local government identify garbage piles, damaged roads, potholes, overflowing dustbins, drainage or sewage failures.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Photographic Evidence */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-saffron-500" />
                  <span>1. Photo of Public Problem</span>
                  <span className="text-rose-500">*</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload or capture a photo using mobile camera of garbage, broken roads, potholes, drainage, or sewage.
                </p>
              </div>
            </div>

            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Upload Area / Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {imagePreview ? (
                <div className="relative h-56 rounded-xl overflow-hidden border-2 border-dashed border-emerald-400 bg-slate-900 group">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold"
                    >
                      Change Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setImagePreview('');
                        setSampleImageUrl('');
                      }}
                      className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-56 rounded-xl border-2 border-dashed border-slate-300 hover:border-saffron-400 bg-slate-50 hover:bg-orange-50/20 transition-all flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 text-saffron-600 flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Snap Photo with Camera or Upload Image
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Supports JPG, PNG, WEBP (Max 10MB)
                    </span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-saffron-500 hover:bg-saffron-600 text-white text-xs font-bold rounded-lg shadow-xs"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Take Photo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Browse Files</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Sample Presets (For testing on PC without live camera) */}
              <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Desktop Quick Test Presets:</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Click a sample problem photo below to test form submission immediately:
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {SAMPLE_ISSUE_PHOTOS.map((sample, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => handleSelectSample(sample)}
                      className={`relative h-16 rounded-lg overflow-hidden border transition-all text-left group ${
                        sampleImageUrl === sample.url ? 'ring-2 ring-saffron-500 border-transparent' : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <img src={sample.url} alt={sample.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex items-end p-1">
                        <span className="text-[10px] font-semibold text-white leading-tight truncate">
                          {sample.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Problem Details & Category */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-saffron-500 text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>Problem Details & Category</span>
            </h2>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Complaint Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Deep pothole causing skidding at MG Road junction"
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:outline-none"
              />
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Problem Category <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CATEGORIES.map(cat => (
                  <label
                    key={cat.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      category === cat.id 
                        ? 'border-saffron-500 bg-orange-50/50 shadow-xs ring-1 ring-saffron-500' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat.id}
                      checked={category === cat.id}
                      onChange={() => setCategory(cat.id)}
                      className="mt-0.5 text-saffron-600 focus:ring-saffron-500"
                    />
                    <div>
                      <div className="font-bold text-xs text-slate-800">{cat.name}</div>
                      <div className="text-[11px] text-slate-500 leading-tight mt-0.5">{cat.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Short Description & Observations <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the severity, duration of the issue, and immediate hazards to citizens or commuters..."
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Section 3: GPS & Address Location */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-saffron-500 text-white text-xs flex items-center justify-center font-bold">3</span>
                <span>GPS Location & Postal Address</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically capture current GPS coordinates or adjust location by clicking the map.
              </p>
            </div>

            <LocationPicker location={location} setLocation={setLocation} />
          </div>

          {/* Section 4: Citizen Information */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-saffron-500 text-white text-xs flex items-center justify-center font-bold">4</span>
              <span>Citizen Contact Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder="e.g. Amit Sharma"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={citizenEmail}
                  onChange={(e) => setCitizenEmail(e.target.value)}
                  placeholder="e.g. amit.sharma@example.com"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (Optional)</label>
                <input
                  type="tel"
                  value={citizenPhone}
                  onChange={(e) => setCitizenPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
              <span>Your contact info is strictly confidential and protected under Indian civic grievance privacy guidelines.</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-gradient-to-r from-saffron-500 via-orange-600 to-amber-600 hover:from-saffron-600 hover:to-orange-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Transmitting Grievance to Civic Dispatch...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Public Complaint & Generate Tracking ID</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
