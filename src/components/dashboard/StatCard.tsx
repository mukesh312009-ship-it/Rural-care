import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'teal',
  trend,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <span>{title}</span>
        <Icon className={`w-4 h-4 text-${color}-600`} />
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <p className="text-2xl font-black text-slate-900">{value}</p>
        {trend && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{trend}</span>}
      </div>
      {subtitle && <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
};
