import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, query, where, orderBy, limit, collectionData, Timestamp } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable, switchMap, of } from 'rxjs';

export interface HistoryEntry {
    userId: string;
    type: 'file' | 'unit' | 'currency' | 'text' | 'genkit';
    details: string;
    timestamp: Timestamp;
}

@Injectable({
    providedIn: 'root'
})
export class HistoryService {
    private firestore = inject(Firestore);
    private authService = inject(AuthService);

    constructor() { }

    async addEntry(type: HistoryEntry['type'], details: string): Promise<void> {
        try {
            const user = this.authService.auth.currentUser;
            console.log('[HistoryService] addEntry called:', { type, details, user: user?.uid });

            if (!user) {
                console.error('[HistoryService] No user logged in, cannot add history entry');
                return;
            }

            const entry = {
                userId: user.uid,
                type,
                details,
                timestamp: Timestamp.now()
            };

            const historyCollection = collection(this.firestore, 'history');
            const docRef = await addDoc(historyCollection, entry);
            console.log('[HistoryService] Entry added successfully:', docRef.id, entry);
        } catch (error) {
            console.error('[HistoryService] Error adding entry:', error);
        }
    }

    getHistory(): Observable<any[]> {
        return this.authService.user$.pipe(
            switchMap(user => {
                console.log('[HistoryService] getHistory called for user:', user?.uid);

                if (!user) {
                    console.log('[HistoryService] No user, returning empty array');
                    return of([]);
                }

                const historyCollection = collection(this.firestore, 'history');
                const q = query(
                    historyCollection,
                    where('userId', '==', user.uid),
                    orderBy('timestamp', 'desc'),
                    limit(10)
                );

                return collectionData(q, { idField: 'id' });
            })
        );
    }
}
