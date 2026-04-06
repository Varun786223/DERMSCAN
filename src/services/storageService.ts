import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { DiagnosisResult, SymptomData } from './types';

interface DermScanDB extends DBSchema {
  scans: {
    key: string;
    value: {
      id: string;
      timestamp: number;
      image: string;
      symptoms: SymptomData;
      result: DiagnosisResult;
    };
    indexes: { 'by-date': number };
  };
}

let dbPromise: Promise<IDBPDatabase<DermScanDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<DermScanDB>('dermscan-db', 1, {
      upgrade(db) {
        const store = db.createObjectStore('scans', {
          keyPath: 'id',
        });
        store.createIndex('by-date', 'timestamp');
      },
    });
  }
  return dbPromise;
}

export async function saveScan(image: string, symptoms: SymptomData, result: DiagnosisResult) {
  const db = await getDB();
  const id = crypto.randomUUID();
  await db.put('scans', {
    id,
    timestamp: Date.now(),
    image,
    symptoms,
    result,
  });
  return id;
}

export async function getAllScans() {
  const db = await getDB();
  return db.getAllFromIndex('scans', 'by-date');
}

export async function deleteScan(id: string) {
  const db = await getDB();
  await db.delete('scans', id);
}
