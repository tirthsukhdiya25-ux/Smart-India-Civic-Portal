import React from 'react';
import { Clock, Eye, Send, Wrench, CheckCircle2, XCircle } from 'lucide-react';
import { STATUS_CONFIG } from '../data/indiaGeoData';

export const StatusBadge = ({ status = 'Submitted', size = 'md' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['Submitted'];

  const getIcon = () => {
    switch (status) {
      case 'Submitted':
        return <Clock className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />;
      case 'Under Review':
        return <Eye className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />;
      case 'Assigned to Department':
        return <Send className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />;
      case 'Work in Progress':
        return <Wrench className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />;
      case 'Resolved':
        return <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />;
      case 'Rejected':
        return <XCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2'
  }[size] || 'text-xs font-semibold px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-xs transition-colors ${config.badgeClass} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`}></span>
      {getIcon()}
      <span>{config.label}</span>
    </span>
  );
};
