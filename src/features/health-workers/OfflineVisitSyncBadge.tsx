import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

interface OfflineVisitSyncBadgeProps {
  pendingCount: number;
  onSync?: () => void;
}

export const OfflineVisitSyncBadge: React.FC<OfflineVisitSyncBadgeProps> = ({
  pendingCount,
  onSync,
}) => {
  if (pendingCount === 0) return null;

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200">
      <WifiOff className="w-3.5 h-3.5 text-amber-700" />
      <span>{pendingCount} Queued Offline</span>
      {onSync && (
        <button onClick={onSync} className="ml-1 text-amber-800 underline hover:text-amber-950">
          Sync
        </button>
      )}
    </div>
  );
};
