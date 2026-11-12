import React from 'react';
import { FollowUpUrgency } from '../../types';

interface FollowUpUrgencyBadgeProps {
  urgency: FollowUpUrgency;
}

export const FollowUpUrgencyBadge: React.FC<FollowUpUrgencyBadgeProps> = ({ urgency }) => {
  const getBadgeStyle = () => {
    switch (urgency) {
      case 'Emergency':
      case 'High':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${getBadgeStyle()}`}>
      {urgency} Urgency
    </span>
  );
};
