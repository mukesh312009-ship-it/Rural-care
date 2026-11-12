import React from 'react';
import { PhoneCall } from 'lucide-react';

export const EmergencyHotlineCard: React.FC = () => {
  return (
    <div className="p-4 rounded-2xl bg-rose-600 text-white flex items-center justify-between">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-rose-200">National Helpline</span>
        <div className="text-3xl font-black">112 / 108</div>
      </div>
      <a href="tel:112" className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition">
        <PhoneCall className="w-6 h-6" />
      </a>
    </div>
  );
};
