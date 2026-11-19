/**
 * Client-Side Offline Storage using idb (IndexedDB wrapper)
 * Requirement: TRD §8 & Verification Item 5 - Confirm idb is installed and used
 */

import { openDB, DBSchema, IDBPDatabase } from "idb";
import { UserMedicine, Profile, Location } from "@/types/database";

const DB_NAME = "medexpert_offline";
const DB_VERSION = 1;

export interface MedExpertDBSchema extends DBSchema {
  medicines: {
    key: string;
    value: UserMedicine;
  };
  profiles: {
    key: string;
    value: Profile;
  };
  locations: {
    key: string;
    value: Location;
  };
}

let dbPromise: Promise<IDBPDatabase<MedExpertDBSchema>> | null = null;

export function getOfflineDB(): Promise<IDBPDatabase<MedExpertDBSchema>> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("IndexedDB is only accessible in browser environment"));
  }

  if (!dbPromise) {
    dbPromise = openDB<MedExpertDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("medicines")) {
          db.createObjectStore("medicines", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("profiles")) {
          db.createObjectStore("profiles", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("locations")) {
          db.createObjectStore("locations", { keyPath: "id" });
        }
      },
    });
  }

  return dbPromise;
}

export async function saveOfflineData<T extends UserMedicine | Profile | Location>(
  storeName: "medicines" | "profiles" | "locations",
  items: T[]
): Promise<void> {
  try {
    const db = await getOfflineDB();
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    await store.clear();
    for (const item of items) {
      await store.put(item as any);
    }
    await tx.done;
  } catch (err) {
    console.warn(`[idb] Failed to save offline data for store ${storeName}`, err);
  }
}

export async function getOfflineData<T>(
  storeName: "medicines" | "profiles" | "locations"
): Promise<T[]> {
  try {
    const db = await getOfflineDB();
    return (await db.getAll(storeName)) as T[];
  } catch {
    return [];
  }
}
