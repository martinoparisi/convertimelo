import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  doc,
  deleteDoc,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { AuthService } from './auth.service';
import { Observable, switchMap, of } from 'rxjs';

export interface HistoryEntry {
  userId?: string;
  type: 'file' | 'unit' | 'currency' | 'text' | 'genkit' | 'code';
  input: string;
  output: string;
  timestamp: Timestamp;
}

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  constructor() {}

  async addEntry(type: HistoryEntry['type'], input: string, output: string): Promise<void> {
    try {
      // Prefer using observable user so we handle async init of Auth SDK
      const user = this.authService.auth.currentUser;
      console.log('[HistoryService] addEntry called:', { type, input, output, user: user?.uid });

      const entry = {
        type,
        input,
        output,
        timestamp: Timestamp.now(),
      };

      if (!user) {
        // No user logged in: store temporarily in localStorage so history persists across refreshes
        // and can be synced when user logs in.
        const pending = JSON.parse(localStorage.getItem('pending_history') || '[]');
        pending.unshift(entry);
        localStorage.setItem('pending_history', JSON.stringify(pending.slice(0, 50)));
        console.log('[HistoryService] Stored entry locally (no user):', entry);
        return;
      }

      const historyCollection = collection(this.firestore, 'users', user.uid, 'history');
      const docRef = await addDoc(historyCollection, entry);
      console.log('[HistoryService] Entry added successfully:', docRef.id, entry);
    } catch (error) {
      console.error('[HistoryService] Error adding entry:', error);
    }
  }

  getHistory(): Observable<any[]> {
    return this.authService.user$.pipe(
      switchMap((user) => {
        console.log('[HistoryService] getHistory called for user:', user?.uid);

        if (!user) {
          console.log('[HistoryService] No user, returning empty array');
          return of([]);
        }

        const historyCollection = collection(this.firestore, 'users', user.uid, 'history');
        const q = query(historyCollection, orderBy('timestamp', 'desc'), limit(20));

        return new Observable<any[]>((observer) => {
          const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
              const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
              observer.next(data);
            },
            (error) => {
              console.error('[HistoryService] Error getting history:', error);
              observer.error(error);
            }
          );
          return () => unsubscribe();
        });
      })
    );
  }

  // Call this on app init to sync any locally stored history to Firestore when user logs in
  async syncPendingOnLogin(): Promise<void> {
    this.authService.user$.subscribe(async (user) => {
      if (!user) return;
      const pending = JSON.parse(localStorage.getItem('pending_history') || '[]');
      if (!pending || !pending.length) return;

      const historyCollection = collection(this.firestore, 'users', user.uid, 'history');
      for (const entry of pending) {
        try {
          const toSave = { ...entry, timestamp: Timestamp.now() };
          await addDoc(historyCollection, toSave as any);
        } catch (err) {
          console.error('[HistoryService] Failed syncing entry', entry, err);
        }
      }
      localStorage.removeItem('pending_history');
      console.log('[HistoryService] Synced pending history to Firestore for user', user.uid);
    });
  }

  async clearHistoryForCurrentUser(): Promise<void> {
    const user = this.authService.auth.currentUser;
    if (!user) {
      console.warn('[HistoryService] clearHistory called but no user logged in');
      return;
    }

    try {
      const historyCollection = collection(this.firestore, 'users', user.uid, 'history');
      const snapshot = await getDocs(historyCollection);
      // Delete each doc by id
      for (const docSnap of snapshot.docs) {
        try {
          await deleteDoc(docSnap.ref);
        } catch (err) {
          console.error('[HistoryService] error deleting item', docSnap.id, err);
        }
      }
      console.log('[HistoryService] clearHistoryForCurrentUser completed');
    } catch (err) {
      console.error('[HistoryService] clearHistoryForCurrentUser failed', err);
    }
  }

  async deleteEntry(entryId: string): Promise<void> {
    const user = this.authService.auth.currentUser;
    if (!user) return;

    try {
      const docRef = doc(this.firestore, 'users', user.uid, 'history', entryId);
      await deleteDoc(docRef);
    } catch (err) {
      console.error('[HistoryService] Error deleting entry:', err);
      throw err;
    }
  }
}
