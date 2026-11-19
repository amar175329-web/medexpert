/**
 * Client-Side Offline Storage using IndexedDB
 * Requirement: TRD §8 - Saved data viewable offline (shelf, profiles, emergency contacts)
 */

import { UserMedicine, Profile, Location } from "@/types/database";

const DB_NAME = "medexpert_offline";
const DB_VERSION = 1;

export function openOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      return reject(new Error("IndexedDB not available in current environment"));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("medicines")) {
        db.createObjectStore("medicines", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("profiles")) {
        db.createObjectStore("profiles", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("locations")) {
        db.createObjectStore("locations", { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveOfflineData<T extends { id: string }>(
  storeName: "medicines" | "profiles" | "locations",
  items: T[]
): Promise<void> {
  try {
    const db = await openOfflineDB();
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.clear();
    for (const item of items) {
      store.put(item);
    }
  } catch (err) {
    console.warn(`[OfflineDB] Failed to save offline cache for ${storeName}`, err);
  }
}

export async function getOfflineData<T>(
  storeName: "medicines" | "profiles" | "locations"
): Promise<T[]> {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}
