import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { CategoryPill } from './CategoryPill';

export const ComplaintCard = ({ complaint }) => {
  if (!complaint) return null;

  const defaultImg = "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80";
  const displayImage = complaint.imageUrl || defaultImg;
  const isResolved = complaint.status === 'Resolved';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-elevated transition-all duration-300 flex flex-col group">
      {/* Card Image Banner */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        <img
          src={displayImage}
          alt={complaint.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImg;
          }}
        />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none gap-2">
          <span className="font-mono text-[11px] font-bold bg-slate-900/85 backdrop-blur-xs text-white px-2.5 py-1 rounded-md shadow-xs">
            {complaint.complaintId}
          </span>
          <StatusBadge status={complaint.status} size="sm" />
        </div>

        {/* Resolved Badge with Proof Indicator */}
        {isResolved && (
          <div className="absolute bottom-2 right-2 bg-emerald-600/95 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Action Completed</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="mb-2.5">
            <CategoryPill category={complaint.category} size="xs" />
          </div>

          <h3 className="font-bold text-slate-800 text-base leading-snug line-clamp-1 group-hover:text-saffron-600 transition-colors">
            {complaint.title}
          </h3>

          <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">
            {complaint.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center text-slate-500 text-xs gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-saffron-500 shrink-0" />
            <span className="truncate">
              {complaint.location?.landmark ? `${complaint.location.landmark}, ` : ''}
              {complaint.location?.city}, {complaint.location?.state}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>

            <Link
              to={`/track?id=${complaint.complaintId}`}
              className="inline-flex items-center text-xs font-semibold text-chakra-600 hover:text-chakra-800 transition-colors gap-1 group/btn"
            >
              <span>Track Issue</span>
              <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
