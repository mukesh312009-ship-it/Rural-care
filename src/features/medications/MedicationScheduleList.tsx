import React from 'react';
import { Pill, Clock } from 'lucide-react';
import { Medication } from '../../types';

interface MedicationScheduleListProps {
  medications: Medication[];
}

export const MedicationScheduleList: React.FC<MedicationScheduleListProps> = ({ medications }) => {
  return (
    <div className="space-y-2">
      {medications.map((m) => (
        <div key={m.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
          <div>
            <strong className="text-slate-800">{m.medicine_name}</strong>
            <p className="text-slate-500">{m.dosage_instructions}</p>
          </div>
          <span className="text-teal-700 font-semibold">{m.reminder_time}</span>
        </div>
      ))}
    </div>
  );
};
