import React from 'react';
import { ReferralStatus } from '../../types';

interface ReferralStatusStepperProps {
  currentStatus: ReferralStatus;
}

const STEPS: ReferralStatus[] = ['Created', 'Sent', 'Accepted', 'In Progress', 'Completed'];

export const ReferralStatusStepper: React.FC<ReferralStatusStepperProps> = ({ currentStatus }) => {
  const currentIndex = STEPS.indexOf(currentStatus);

  return (
    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 py-2">
      {STEPS.map((step, idx) => {
        const isDone = idx <= currentIndex;
        return (
          <div key={step} className="flex flex-col items-center flex-1">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] mb-1 font-bold ${
                isDone ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              {idx + 1}
            </div>
            <span className={idx === currentIndex ? 'text-teal-800 font-extrabold' : ''}>{step}</span>
          </div>
        );
      })}
    </div>
  );
};
