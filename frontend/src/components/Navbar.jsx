import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  PlusCircle, 
  Search, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  ChevronDown,
  Building,
  Flag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout, loginAsDemo } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleDemoSelect = async (role) => {
    setDemoMenuOpen(false);
    await loginAsDemo(role);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Indian National Tricolor Stripe */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#FF671F]" title="Saffron - Courage & Sacrifice" />
        <div className="flex-1 bg-white relative flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#000080]" />
        </div>
        <div className="flex-1 bg-[#046A38]" title="Green - Prosperity" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Portal Title */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            {/* Ashoka Chakra & Emblem Motif */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-500 via-orange-600 to-amber-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 animate-[spin_30s_linear_infinite]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                <circle cx="50" cy="50" r="44" strokeWidth="4" />
                <circle cx="50" cy="50" r="12" strokeWidth="4" />
                {Array.from({ length: 24 }).map((_, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={50 + 44 * Math.cos((i * 15 * Math.PI) / 180)}
                    y2={50 + 44 * Math.sin((i * 15 * Math.PI) / 180)}
                    strokeWidth="2.5"
                  />
                ))}
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 group-hover:text-saffron-600 transition-colors">
                  SMART INDIA
                </span>
                <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-1.5 py-0.2 rounded border border-orange-200">
                  CIVIC
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">
                Govt. Civic Issue & Action Portal
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-orange-50 text-saffron-700 font-bold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </Link>

            <Link
              to="/map"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/map') 
                  ? 'bg-orange-50 text-saffron-700 font-bold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-4 h-4 text-saffron-600" />
              <span>India Map</span>
            </Link>

            <Link
              to="/track"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/track') 
                  ? 'bg-orange-50 text-saffron-700 font-bold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4 text-chakra-600" />
              <span>Track Complaint</span>
            </Link>

            {/* If logged in citizen */}
            {isAuthenticated && !isAdmin && (
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-lg transition-colors ${
                  isActive('/dashboard') 
                    ? 'bg-orange-50 text-saffron-700 font-bold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                My Complaints
              </Link>
            )}

            {/* Admin Portal link */}
            <Link
              to="/admin"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/admin') 
                  ? 'bg-chakra-50 text-chakra-800 font-bold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-chakra-700" />
              <span>Admin Portal</span>
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Primary CTA: Report a Problem */}
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-saffron-500 to-orange-600 hover:from-saffron-600 hover:to-orange-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm shadow-orange-500/20 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Public Problem</span>
            </Link>

            {/* Demo Switcher Quick Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
                title="Instant Demo Role Switching"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Demo Roles</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Switch Test Account
                  </div>
                  <button
                    onClick={() => handleDemoSelect('admin')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <ShieldCheck className="w-4 h-4 text-chakra-600" />
                    <div>
                      <div className="font-bold">Govt. Admin Officer</div>
                      <div className="text-[10px] text-slate-400">admin@smartindia.gov.in</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDemoSelect('citizen')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <User className="w-4 h-4 text-saffron-600" />
                    <div>
                      <div className="font-bold">Citizen (Amit Sharma)</div>
                      <div className="text-[10px] text-slate-400">amit.sharma@example.com</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* User Profile / Auth State */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {user?.name?.split(' ')[0]}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase">
                    {user?.role}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <Link
                  to="/login"
                  className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-saffron-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 text-xs font-bold text-chakra-700 bg-chakra-50 hover:bg-chakra-100 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/report"
              className="p-2 bg-saffron-500 text-white rounded-lg"
              title="Report Issue"
            >
              <PlusCircle className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-700"
            >
              Home
            </Link>
            <Link
              to="/map"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-700 flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-saffron-500" />
              <span>India Map</span>
            </Link>
            <Link
              to="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-700 flex items-center gap-1.5"
            >
              <Search className="w-4 h-4 text-chakra-500" />
              <span>Track ID</span>
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-700 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Quick Demo Logins for Mobile */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Quick Demo Login</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleDemoSelect('citizen');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-1.5 bg-orange-50 text-orange-800 text-xs font-bold rounded-lg border border-orange-200"
              >
                Citizen
              </button>
              <button
                onClick={() => {
                  handleDemoSelect('admin');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-1.5 bg-blue-50 text-blue-800 text-xs font-bold rounded-lg border border-blue-200"
              >
                Gov Admin
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            {isAuthenticated ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-slate-700">{user?.name}</span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-rose-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 w-full">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-xs font-bold text-slate-700 bg-slate-100 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-xs font-bold text-white bg-saffron-500 rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
