import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Shield, ExternalLink, Heart, Globe, Award } from 'lucide-react';
import { CATEGORIES } from '../data/indiaGeoData';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & National Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-saffron-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                🇮🇳
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight">SMART INDIA</span>
                <p className="text-[11px] text-slate-400">Civic Action Portal</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering citizens across all 28 States and 8 Union Territories to report infrastructure defects, sanitation backlogs, and public hazards directly to municipal and state government departments.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>24x7 Digital Citizen Redressal System</span>
            </div>
          </div>

          {/* Col 2: Emergency & Civic Toll-Free Helplines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-saffron-500" />
              <span>National Helplines</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">National Emergency:</span>
                <span className="font-bold font-mono text-saffron-400">112</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Municipal Services:</span>
                <span className="font-bold font-mono text-white">1913</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Swachh Bharat Helpline:</span>
                <span className="font-bold font-mono text-white">1800-11-0031</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">NHAI Pothole Helpline:</span>
                <span className="font-bold font-mono text-white">1033</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Government Departments */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Connected Departments
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {CATEGORIES.slice(0, 6).map(c => (
                <li key={c.id}>
                  <Link to={`/map?category=${encodeURIComponent(c.id)}`} className="hover:text-saffron-400 transition-colors flex items-center justify-between">
                    <span>{c.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Quick Portals & Verification */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Citizen Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/report" className="text-saffron-400 hover:underline font-semibold block">
                  Lodging a New Complaint
                </Link>
              </li>
              <li>
                <Link to="/track" className="text-slate-300 hover:text-white transition-colors block">
                  Track Complaint by Unique ID
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-slate-300 hover:text-white transition-colors block">
                  Interactive India Heatmap
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-slate-300 hover:text-white transition-colors block">
                  Government Official Login
                </Link>
              </li>
            </ul>

            <div className="mt-4 p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 font-bold text-white mb-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Privacy & Protection</span>
              </div>
              Citizen personal contact info is encrypted and shared strictly with investigating field squads.
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Smart India Civic Portal. Digital India & Swachh Bharat Initiative.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span>Made with pride for a better India</span>
              <span className="text-saffron-500">🇮🇳</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
