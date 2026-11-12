import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface RuralCareDB extends DBSchema {
  offline_visits: {
    key: string;
    value: {
      id: string;
      taskId: string;
      patientId: string;
      patientName: string;
      visitNotes: string;
      vitals: {
        bp?: string;
        sugar?: string;
        pulse?: number;
        spo2?: number;
      };
      statusReported: string;
      recordedAt: string;
      synced: boolean;
    };
  };
  sync_queue: {
    key: string;
    value: {
      id: string;
      type: 'home_visit' | 'patient_registration' | 'medication_log';
      payload: any;
      createdAt: string;
      status: 'pending' | 'syncing' | 'failed' | 'synced';
      retryCount: number;
    };
  };
}

const DB_NAME = 'ruralcare_offline_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<RuralCareDB>> | null = null;

export const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<RuralCareDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('offline_visits')) {
          db.createObjectStore('offline_visits', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('sync_queue')) {
          db.createObjectStore('sync_queue', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
};

export const saveOfflineVisit = async (visit: {
  taskId: string;
  patientId: string;
  patientName: string;
  visitNotes: string;
  vitals: { bp?: string; sugar?: string; pulse?: number; spo2?: number };
  statusReported: string;
}) => {
  const db = await getDB();
  const id = `visit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const record = {
    id,
    ...visit,
    recordedAt: new Date().toISOString(),
    synced: false,
  };
  await db.put('offline_visits', record);

  // Also push to sync_queue
  await db.put('sync_queue', {
    id: `sync_${id}`,
    type: 'home_visit',
    payload: record,
    createdAt: new Date().toISOString(),
    status: 'pending',
    retryCount: 0,
  });

  return record;
};

export const getOfflineVisits = async () => {
  const db = await getDB();
  return db.getAll('offline_visits');
};

export const getSyncQueue = async () => {
  const db = await getDB();
  return db.getAll('sync_queue');
};

export const clearSyncedQueue = async () => {
  const db = await getDB();
  const tx = db.transaction('sync_queue', 'readwrite');
  const all = await tx.store.getAll();
  for (const item of all) {
    if (item.status === 'synced') {
      await tx.store.delete(item.id);
    }
  }
  await tx.done;
};
