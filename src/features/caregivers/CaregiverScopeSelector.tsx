import React from 'react';
import { CaregiverPermission } from '../../types';

interface CaregiverScopeSelectorProps {
  permission: CaregiverPermission;
  onChange: (field: keyof CaregiverPermission) => void;
}

export const CaregiverScopeSelector: React.FC<CaregiverScopeSelectorProps> = ({
  permission,
  onChange,
}) => {
  return (
    <div className="space-y-2 text-xs">
      <label className="flex items-center justify-between p-2 bg-slate-50 rounded-xl cursor-pointer">
        <span>View Appointments</span>
        <input
          type="checkbox"
          checked={permission.can_view_appointments}
          onChange={() => onChange('can_view_appointments')}
          className="rounded text-teal-600"
        />
      </label>
      <label className="flex items-center justify-between p-2 bg-slate-50 rounded-xl cursor-pointer">
        <span>View Medications</span>
        <input
          type="checkbox"
          checked={permission.can_view_medications}
          onChange={() => onChange('can_view_medications')}
          className="rounded text-teal-600"
        />
      </label>
    </div>
  );
};
