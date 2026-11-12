import React from 'react';
import { Heart, Activity, Thermometer, Weight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface PatientVitalsCardProps {
  bp?: string;
  sugar?: string;
  pulse?: number;
  spo2?: number;
}

export const PatientVitalsCard: React.FC<PatientVitalsCardProps> = ({
  bp = '120/80',
  sugar = '110 mg/dL',
  pulse = 72,
  spo2 = 98,
}) => {
  const { language } = useLanguage();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-teal-50/70 border border-teal-100 rounded-2xl">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] text-teal-700 font-semibold block uppercase">BP</span>
          <strong className="text-sm font-extrabold text-slate-800">{bp}</strong>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
          <Heart className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] text-sky-700 font-semibold block uppercase">Sugar</span>
          <strong className="text-sm font-extrabold text-slate-800">{sugar}</strong>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] text-rose-700 font-semibold block uppercase">Pulse</span>
          <strong className="text-sm font-extrabold text-slate-800">{pulse} bpm</strong>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] text-emerald-700 font-semibold block uppercase">SpO2</span>
          <strong className="text-sm font-extrabold text-slate-800">{spo2}%</strong>
        </div>
      </div>
    </div>
  );
};
