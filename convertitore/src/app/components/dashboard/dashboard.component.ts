import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HistoryService, HistoryEntry } from '../../services/history.service';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="bg-slate-800/50 backdrop-blur-sm shadow-lg border border-indigo-500/20 rounded-lg p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(79,70,229,0.15)]">
        <h2 class="text-2xl font-bold text-white drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]">Bentornato!</h2>
        <p class="mt-2 text-gray-300">Seleziona uno strumento dalla barra di navigazione per iniziare.</p>
      </div>

      <div class="bg-slate-800/50 backdrop-blur-sm shadow-lg border border-indigo-500/20 rounded-lg p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(79,70,229,0.15)]">
        <h3 class="text-lg font-medium text-white mb-4 drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]">Attività Recente</h3>
        
        <div class="flow-root">
          <ul class="-mb-8">
            <li *ngFor="let item of history$ | async">
              <div class="relative pb-8">
                <span class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-indigo-500/20" aria-hidden="true"></span>
                <div class="relative flex space-x-3">
                  <div>
                    <span class="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center ring-8 ring-slate-900 shadow-[0_0_10px_rgba(79,70,229,0.5)]">
                      <!-- Icon based on type -->
                      <svg *ngIf="item.type === 'file'" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <svg *ngIf="item.type === 'unit'" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                      <svg *ngIf="item.type === 'currency'" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <svg *ngIf="item.type === 'text'" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <svg *ngIf="item.type === 'genkit'" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </span>
                  </div>
                  <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p class="text-sm text-gray-300">{{ item.details }}</p>
                    </div>
                    <div class="text-right text-sm whitespace-nowrap text-gray-400">
                      <time [dateTime]="item.timestamp.toDate()?.toISOString()">{{ item.timestamp.toDate() | date:'short' }}</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div *ngIf="(history$ | async)?.length === 0" class="text-center text-gray-400 py-4">
            Nessuna attività recente.
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent {
  private historyService = inject(HistoryService);
  history$ = this.historyService.getHistory().pipe(
    map(items => items as HistoryEntry[])
  );
}
