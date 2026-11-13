# 🇮🇳 Smart India – Civic Issue Reporting & Government Action Portal

> **"Your City, Your Voice, Better India."**  
> *Report Public Problems. Help Build a Cleaner and Better India.*

A modern, responsive, full-stack civic action platform built for India that enables citizens to report public infrastructure defects (garbage piles, broken roads, potholes, overflowing dustbins, drainage failures, pipeline leaks) and connects them directly with responsible government departments via an interactive India map and comprehensive administrative dashboard.

---

## 🌟 Key Highlights & Features

### 1. 📸 Report a Public Problem
- **Mobile Camera & File Upload**: Snap photos directly via camera (`capture="environment"`) or upload image files (JPG, PNG, WEBP).
- **Desktop Testing Presets**: Includes one-click sample photo buttons (garbage dumps, potholes, collapsed drain slabs, pipeline burst, dark streetlights) for testing on devices without cameras.
- **Problem Categories**:
  - 🟠 **Sanitation Department**: Garbage heaps, overflowing dustbins, uncollected waste, street cleaning.
  - 🔴 **Road and Transport Department**: Potholes, broken roads, damaged asphalt, traffic signals.
  - 🟣 **Public Works Department (PWD)**: Broken footpaths, flyover/bridge structural defects.
  - 🟢 **Drainage Department**: Open manholes, clogged gutters, overflowing sewage.
  - 🔵 **Water Supply Department**: Pipeline leaks, contaminated water, low pressure.
  - 🟡 **Municipal Corporation**: Defective streetlights, public parks, stray cattle, unauthorized markets.
  - ⚪ **Other Government Departments**: Public space maintenance, illegal encroachments.
- **GPS Location Detection**: Auto-detects device GPS coordinates (`navigator.geolocation`) with one-click reverse geocoding to prefill address, city, district, state, and PIN code.
- **Interactive Pin Picker**: Move the pin anywhere on the Leaflet map to adjust the exact problem spot.
- **Automatic Unique ID Generation**: Creates tracking IDs such as `IND-2026-10482`.

### 2. 🗺️ Interactive India Map Integration
- **Leaflet.js & OpenStreetMap**: Centered on India with custom vector pins color-coded by department category.
- **Interactive Marker Popups**: Clicking any pin displays:
  - Uploaded problem photo
  - Complaint ID & current status badge
  - Category badge & title
  - Full address, city, state, and GPS coordinates
  - Submission date
  - Direct link to track the issue
- **Multi-Level Geographic Filters**:
  - Filter by Indian State / Union Territory (Delhi, Maharashtra, Karnataka, Tamil Nadu, Uttar Pradesh, Rajasthan, Gujarat, West Bengal, etc.)
  - Quick-jump to Major Cities (New Delhi, Mumbai, Bengaluru, Chennai, Kolkata, Hyderabad, Ahmedabad, Jaipur, Lucknow, Pune, Bhopal, etc.)
  - Filter by Department Category and Status
  - Marker legend for instant visual identification

### 3. 🛡️ Government Admin Dashboard
- **Administrative Command Center**: Complete view of all citizen complaints with high-res photos and geolocation.
- **Department Routing**: Assign complaints to the responsible civic authority.
- **Official Field Officer Assignment**: Allocate specific zonal engineers and field squads.
- **Status Progression**:
  - `Submitted` ➔ `Under Review` ➔ `Assigned to Department` ➔ `Work in Progress` ➔ `Resolved` / `Rejected`
- **Rejection Protection**: Mandatory rejection justification explaining civic grounds.
- **Resolution Proof Upload**: Upload photographic verification of completed work (Before vs After comparison).
- **Official Audit Log**: Timestamped record of every administrative action, remark, and status update.
- **Search & Filters**: Search by Complaint ID, city, state, or category.

### 4. 🔍 Public Complaint Tracking System
- **Public Tracker (No Login Required)**: Any citizen can look up their complaint using the unique Complaint ID.
- **Visual Stepper & Timeline**: Step-by-step progress tracker showing the current status, assigned department, officer remarks, and resolution proof.
- **Demo Quick-Search**: Clickable sample IDs for instant test evaluation (`IND-2026-10482`, `IND-2026-21894`, etc.).

### 5. 👥 User Registration, Login & Role Security
- **Citizen Account**: Track personal submitted complaints, view progress, and access saved history in the Citizen Dashboard.
- **Gov Administrator Account**: Full access to the administration dashboard.
- **1-Click Demo Login Switcher**: Instant switching in the navigation bar to test either role without manually typing passwords.

---

## 🔑 Demo Login Credentials

| Role | Email | Password | Access / Notes |
| :--- | :--- | :--- | :--- |
| **Government Admin** | `admin@smartindia.gov.in` | `Admin@123` | Full access to Admin Dashboard, department assignment, and status updates |
| **Citizen (Amit Sharma)**| `amit.sharma@example.com` | `Admin@123` | Citizen Dashboard with pre-submitted complaints |

*(Or simply click **"Demo Roles"** in the top navigation bar to switch with one click!)*

---

## 🛠️ Technology Stack

- **Frontend**:
  - **React 18** (Vite build system)
  - **Tailwind CSS** (Indian Tricolor-themed responsive design)
  - **Leaflet.js & React-Leaflet** (Interactive India map & location picker)
  - **Lucide React** (Civic icons)
- **Backend**:
  - **Node.js & Express.js** (REST API)
  - **Multer** (Photographic evidence & resolution proof upload handling)
  - **JWT (JSON Web Tokens)** & **Bcrypt.js** (Authentication & password hashing)
- **Database**:
  - **Dual Storage Engine**: Supports MongoDB connection via `MONGODB_URI` AND automatically falls back to an embedded JSON database (`backend/data/db.json`). Runs seamlessly out-of-the-box on any machine without needing a running MongoDB daemon!

---

## 🚀 How to Run Locally

### Quick Start (Full-Stack Single Command)

1. Open a terminal in the project directory:
   ```bash
   cd "modern india"
   ```

2. Start the unified full-stack server (serves both API and production frontend build):
   ```bash
   npm start
   ```

3. Open your browser and navigate to:
   👉 **http://localhost:5000**

---

### Development Mode (Independent Frontend & Backend)

#### 1. Backend Server
```bash
cd backend
npm run dev
# Running on http://localhost:5000
```

#### 2. Frontend Vite Dev Server
```bash
cd frontend
npm run dev
# Running on http://localhost:5173
```

---

## 📁 Project Structure

```text
modern india/
├── backend/
│   ├── data/
│   │   ├── initialSeed.js        # Seed complaints across Delhi, Mumbai, Bengaluru, etc.
│   │   └── db.json               # Auto-created persistent storage
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & role validation
│   │   └── upload.js             # Multer image upload handler
│   ├── models/
│   │   ├── User.js               # User mongoose model
│   │   └── Complaint.js          # Complaint mongoose model
│   ├── routes/
│   │   ├── authRoutes.js         # Register, Login, Me, Demo accounts
│   │   ├── complaintRoutes.js    # Public complaints, stats, tracking, submission
│   │   └── adminRoutes.js        # Administrative status update & department assignment
│   ├── services/
│   │   └── storageService.js     # Unified MongoDB / JSON database engine
│   ├── uploads/                  # Uploaded problem photos
│   ├── server.js                 # Express server & frontend static hosting
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Tricolor header with quick demo switcher
│   │   │   ├── Footer.jsx        # Helplines (112, 1913, 1800-11-0031)
│   │   │   ├── IndiaMap.jsx      # Leaflet interactive map with custom pins
│   │   │   ├── LocationPicker.jsx# GPS auto-detect & pin positioner
│   │   │   ├── ComplaintCard.jsx # Grid card with image & badges
│   │   │   ├── StatusBadge.jsx   # Status indicator badge
│   │   │   ├── CategoryPill.jsx  # Category badge with icons
│   │   │   └── TimelineTracker.jsx # 5-step status stepper & audit log
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Authentication context
│   │   ├── data/
│   │   │   └── indiaGeoData.js   # States, cities, categories, sample photos
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # Hero, embedded map, live stats, feeds
│   │   │   ├── ReportProblemPage.jsx # Camera/photo, GPS, category form
│   │   │   ├── LiveMapPage.jsx   # Dedicated full-page interactive map
│   │   │   ├── TrackComplaintPage.jsx # Public ID tracker with stepper
│   │   │   ├── AdminDashboardPage.jsx # Government administration portal
│   │   │   ├── UserDashboardPage.jsx  # Citizen personal dashboard
│   │   │   ├── LoginPage.jsx     # Login with 1-click demo buttons
│   │   │   └── RegisterPage.jsx  # Citizen registration
│   │   ├── services/
│   │   │   └── api.js            # Frontend API client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── package.json
└── README.md
```

---

## 🇮🇳 Civic National Mission Alignment
Built in support of **Digital India**, **Swachh Bharat Abhiyan**, and **Smart Cities Mission** to foster transparent, accountable, and responsive urban governance.
