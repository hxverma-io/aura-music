import { Track } from '../types';

const DB_NAME = 'aura_music_db';
const STORE_NAME = 'offline_tracks';
const DB_VERSION = 1;

export interface OfflineRecord {
  id: string;
  track: Track;
  blob: Blob;
  downloadedAt: string;
  sizeBytes: number;
}

class OfflineService {
  private db: IDBDatabase | null = null;
  private isReady: Promise<IDBDatabase>;

  constructor() {
    this.isReady = this.initDB();
  }

  private initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        return reject('IndexedDB is not supported in this environment');
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = (e: any) => {
        this.db = e.target.result;
        resolve(this.db!);
      };

      request.onerror = (e) => {
        console.error('IndexedDB open error:', e);
        reject(e);
      };
    });
  }

  public async saveTrackOffline(track: Track): Promise<OfflineRecord> {
    const db = await this.isReady;

    // Fetch the audio stream blob via backend proxy to avoid CORS issues
    let blob: Blob;
    try {
      const proxyUrl = `/api/music/proxy?url=${encodeURIComponent(track.audioUrl)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('Proxy fetch returned non-200');
      blob = await response.blob();
    } catch (e) {
      const directResp = await fetch(track.audioUrl);
      if (!directResp.ok) throw new Error('Failed to fetch audio stream for offline cache');
      blob = await directResp.blob();
    }
    const sizeBytes = blob.size;

    const record: OfflineRecord = {
      id: track.id,
      track: {
        ...track,
        audioUrl: URL.createObjectURL(blob) // Local blob stream URL
      },
      blob: blob,
      downloadedAt: new Date().toISOString(),
      sizeBytes: sizeBytes
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(record);

      request.onsuccess = () => {
        resolve(record);
      };

      request.onerror = (e) => {
        console.error('Failed to save track in IndexedDB:', e);
        reject(e);
      };
    });
  }

  public async getOfflineTrack(id: string): Promise<OfflineRecord | null> {
    const db = await this.isReady;
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        const record = request.result;
        if (record && record.blob) {
          record.track.audioUrl = URL.createObjectURL(record.blob);
          resolve(record);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        resolve(null);
      };
    });
  }

  public async getAllOfflineTracks(): Promise<OfflineRecord[]> {
    const db = await this.isReady;
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = (request.result || []).map((r: OfflineRecord) => {
          if (r.blob) {
            r.track.audioUrl = URL.createObjectURL(r.blob);
          }
          return r;
        });
        resolve(results);
      };

      request.onerror = () => {
        resolve([]);
      };
    });
  }

  public async removeOfflineTrack(id: string): Promise<boolean> {
    const db = await this.isReady;
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  }

  public async isTrackOffline(id: string): Promise<boolean> {
    const record = await this.getOfflineTrack(id);
    return !!record;
  }

  public formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}

export const offlineService = new OfflineService();
