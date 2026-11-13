// Indian States, Union Territories, Major Cities, and Category Configuration

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
  "Chandigarh",
  "Puducherry",
  "Goa"
].sort();

export const MAJOR_CITIES_COORDINATES = [
  { name: "New Delhi", state: "Delhi", lat: 28.6139, lng: 77.2090, zoom: 12 },
  { name: "Mumbai", state: "Maharashtra", lat: 19.0760, lng: 72.8777, zoom: 12 },
  { name: "Bengaluru", state: "Karnataka", lat: 12.9716, lng: 77.5946, zoom: 12 },
  { name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707, zoom: 12 },
  { name: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639, zoom: 12 },
  { name: "Hyderabad", state: "Telangana", lat: 17.3850, lng: 78.4867, zoom: 12 },
  { name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714, zoom: 12 },
  { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873, zoom: 12 },
  { name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462, zoom: 12 },
  { name: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567, zoom: 12 },
  { name: "Chandigarh", state: "Chandigarh", lat: 30.7333, lng: 76.7794, zoom: 12 },
  { name: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lng: 77.4126, zoom: 12 },
  { name: "Patna", state: "Bihar", lat: 25.5941, lng: 85.1376, zoom: 12 },
  { name: "Kochi", state: "Kerala", lat: 9.9312, lng: 76.2673, zoom: 12 }
];

export const CATEGORIES = [
  {
    id: "Sanitation Department",
    name: "Sanitation Department",
    shortName: "Sanitation & Waste",
    icon: "Trash2",
    color: "#f97316", // Orange
    bgLight: "bg-orange-50 text-orange-700 border-orange-200",
    markerColor: "#ea580c",
    description: "Garbage piles, overflowing bins, uncollected waste, street cleaning"
  },
  {
    id: "Road and Transport Department",
    name: "Road and Transport Department",
    shortName: "Roads & Traffic",
    icon: "AlertTriangle",
    color: "#ef4444", // Red
    bgLight: "bg-red-50 text-red-700 border-red-200",
    markerColor: "#dc2626",
    description: "Potholes, damaged asphalt, missing road signs, traffic signal failure"
  },
  {
    id: "Drainage Department",
    name: "Drainage Department",
    shortName: "Drainage & Sewage",
    icon: "Waves",
    color: "#10b981", // Emerald
    bgLight: "bg-emerald-50 text-emerald-700 border-emerald-200",
    markerColor: "#059669",
    description: "Open manholes, blocked stormwater drains, overflowing sewage"
  },
  {
    id: "Water Supply Department",
    name: "Water Supply Department",
    shortName: "Water Supply",
    icon: "Droplets",
    color: "#0284c7", // Blue
    bgLight: "bg-sky-50 text-sky-700 border-sky-200",
    markerColor: "#0284c7",
    description: "Pipeline leaks, drinking water contamination, low water pressure"
  },
  {
    id: "Public Works Department (PWD)",
    name: "Public Works Department (PWD)",
    shortName: "PWD Infrastructure",
    icon: "Hammer",
    color: "#8b5cf6", // Purple
    bgLight: "bg-purple-50 text-purple-700 border-purple-200",
    markerColor: "#7c3aed",
    description: "Damaged footpaths, cracked bridges, collapsed public walls, public buildings"
  },
  {
    id: "Municipal Corporation",
    name: "Municipal Corporation",
    shortName: "Municipal / Streetlights",
    icon: "Building2",
    color: "#eab308", // Yellow / Gold
    bgLight: "bg-amber-50 text-amber-800 border-amber-200",
    markerColor: "#d97706",
    description: "Defective streetlights, public parks, stray cattle, unauthorized markets"
  },
  {
    id: "Other Government Departments",
    name: "Other Government Departments",
    shortName: "Other Civic Issues",
    icon: "HelpCircle",
    color: "#64748b", // Slate
    bgLight: "bg-slate-100 text-slate-700 border-slate-200",
    markerColor: "#475569",
    description: "Noise pollution, illegal encroachments, public garden maintenance"
  }
];

export const STATUS_CONFIG = {
  "Submitted": {
    label: "Submitted",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
    dotClass: "bg-slate-400",
    stepIndex: 1
  },
  "Under Review": {
    label: "Under Review",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-300",
    dotClass: "bg-blue-500",
    stepIndex: 2
  },
  "Assigned to Department": {
    label: "Assigned to Department",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-300",
    dotClass: "bg-indigo-500",
    stepIndex: 3
  },
  "Work in Progress": {
    label: "Work in Progress",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-300",
    dotClass: "bg-amber-500 animate-pulse",
    stepIndex: 4
  },
  "Resolved": {
    label: "Resolved",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-300",
    dotClass: "bg-emerald-500",
    stepIndex: 5
  },
  "Rejected": {
    label: "Rejected",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-300",
    dotClass: "bg-rose-500",
    stepIndex: 0
  }
};

// Preset sample photos for desktop testing when camera is unavailable
export const SAMPLE_ISSUE_PHOTOS = [
  {
    name: "Garbage Overflow",
    category: "Sanitation Department",
    url: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Deep Road Pothole",
    category: "Road and Transport Department",
    url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Water Leakage",
    category: "Water Supply Department",
    url: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Broken Drain Slab",
    category: "Drainage Department",
    url: "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Dark Streetlight",
    category: "Municipal Corporation",
    url: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Damaged Sidewalk",
    category: "Public Works Department (PWD)",
    url: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80"
  }
];
