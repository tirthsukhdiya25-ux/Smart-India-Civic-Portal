import React from 'react';
import { 
  Trash2, 
  AlertTriangle, 
  Waves, 
  Droplets, 
  Hammer, 
  Building2, 
  HelpCircle 
} from 'lucide-react';
import { CATEGORIES } from '../data/indiaGeoData';

const iconMap = {
  Trash2,
  AlertTriangle,
  Waves,
  Droplets,
  Hammer,
  Building2,
  HelpCircle
};

export const CategoryPill = ({ category, showIcon = true, size = 'sm' }) => {
  const cat = CATEGORIES.find(c => c.name.toLowerCase() === (category || '').toLowerCase()) || CATEGORIES[CATEGORIES.length - 1];
  const IconComponent = iconMap[cat.icon] || HelpCircle;

  const sizeClasses = {
    xs: 'text-[11px] px-2 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2'
  }[size] || 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border ${cat.bgLight} ${sizeClasses}`}
      title={cat.name}
    >
      {showIcon && <IconComponent className={size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5'} style={{ color: cat.markerColor }} />}
      <span className="truncate max-w-[200px]">{cat.shortName || cat.name}</span>
    </span>
  );
};
