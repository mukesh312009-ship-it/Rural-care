import React from 'react';
import { HealthCamp } from '../../types';

interface HealthCampCardProps {
  camp: HealthCamp;
  onRegister?: () => void;
}

export const HealthCampCard: React.FC<HealthCampCardProps> = ({ camp, onRegister }) => {
  return (
    <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2">
      <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">{camp.status}</span>
      <h3 className="text-sm font-bold text-slate-900">{camp.title}</h3>
      <p className="text-xs text-slate-500">{camp.location_venue}, {camp.village}</p>
      {onRegister && (
        <button onClick={onRegister} className="w-full py-1.5 bg-teal-600 text-white rounded-xl text-xs font-bold">
          Register
        </button>
      )}
    </div>
  );
};
