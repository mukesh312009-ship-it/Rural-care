import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { clearSyncedQueue, getSyncQueue } from '../../services/offlineStorage';

export const OfflineBanner: React.FC = () => {
  const { language } = useLanguage();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check offline sync queue count
    const checkQueue = async () => {
      try {
        const queue = await getSyncQueue();
        setPendingSyncCount(queue.filter((q) => q.status === 'pending').length);
      } catch (e) {
        // IDB note
      }
    };
    checkQueue();
    const interval = setInterval(checkQueue, 8000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await clearSyncedQueue();
      const queue = await getSyncQueue();
      setPendingSyncCount(queue.filter((q) => q.status === 'pending').length);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  if (isOnline && pendingSyncCount === 0) return null;

  return (
    <div
      className={`px-4 py-2 text-xs font-medium flex items-center justify-between transition-colors shadow-sm ${
        !isOnline
          ? 'bg-amber-600 text-white'
          : 'bg-emerald-600 text-white'
      }`}
    >
      <div className="flex items-center gap-2 max-w-4xl mx-auto w-full justify-between">
        <div className="flex items-center gap-2">
          {!isOnline ? (
            <>
              <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
              <span>
                {language === 'ta'
                  ? 'ஆஃப்லைன் பயன்முறை: இணைய இணைப்பு இல்லை. உங்கள் பதிவுகள் சாதனத்தில் சேமிக்கப்பட்டு பின்னர் ஒத்திசைக்கப்படும்.'
                  : 'Offline Mode: No active internet. Your records are saved safely in local storage and will sync automatically.'}
              </span>
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4 shrink-0" />
              <span>
                {language === 'ta'
                  ? `இணைய இணைப்பு உள்ளது. நிலுவையில் உள்ள பதிவுகள்: ${pendingSyncCount}`
                  : `Online. Pending records waiting for synchronization: ${pendingSyncCount}`}
              </span>
            </>
          )}
        </div>

        {pendingSyncCount > 0 && isOnline && (
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded text-xs transition font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {language === 'ta' ? 'ஒத்திசை' : 'Sync Now'}
          </button>
        )}
      </div>
    </div>
  );
};
