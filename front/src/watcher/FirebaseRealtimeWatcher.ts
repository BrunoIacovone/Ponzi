import { getDatabase, ref, onValue, off, DatabaseReference } from 'firebase/database';

type Callback<T> = (data: T) => void;

export class FirebaseRealtimeWatcher {
  private listeners: { ref: DatabaseReference; callback: any }[] = [];

  watch<T>(path: string, callback: Callback<T>) {
    const db = getDatabase();
    const dbRef = ref(db, path);
    const handler = (snapshot: any) => callback(snapshot.val());
    onValue(dbRef, handler);
    this.listeners.push({ ref: dbRef, callback: handler });
  }

  clearAll() {
    for (const { ref, callback } of this.listeners) {
      off(ref, 'value', callback);
    }
    this.listeners = [];
  }
}