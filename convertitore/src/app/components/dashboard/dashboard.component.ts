import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HistoryService, HistoryEntry } from '../../services/history.service';
import { map } from 'rxjs';

/**
 * Dashboard component displaying user welcome message and recent activity history.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="card">
        <h2
          class="text-2xl font-bold text-gray-900 dark:text-white drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]"
        >
          Bentornato!
        </h2>
        <p class="mt-2 text-gray-600 dark:text-gray-300">
          Seleziona uno strumento dalla barra di navigazione per iniziare.
        </p>
      </div>

      <div class="card">
        <div class="flex justify-between items-center mb-4">
          <h3
            class="text-lg font-medium text-gray-900 dark:text-white drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]"
          >
            Attività Recente
          </h3>
          <button
            (click)="clearHistory()"
            [disabled]="!(history$ | async)?.length"
            class="text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 text-sm flex items-center gap-1 transition-colors px-3 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"
              />
            </svg>
            Svuota
          </button>
        </div>

        <div class="flow-root">
          <ul class="-mb-8">
            <li *ngFor="let item of history$ | async">
              <div class="relative pb-8">
                <span
                  class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-indigo-500/20"
                  aria-hidden="true"
                ></span>
                <div class="relative flex space-x-3">
                  <div>
                    <span
                      class="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center ring-8 ring-white dark:ring-slate-900 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                    >
                      <!-- Icon based on type -->
                      <svg
                        *ngIf="item.type === 'file'"
                        class="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <svg
                        *ngIf="item.type === 'unit'"
                        class="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                        />
                      </svg>
                      <svg
                        *ngIf="item.type === 'currency'"
                        class="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <svg
                        *ngIf="item.type === 'text'"
                        class="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <svg
                        *ngIf="item.type === 'genkit'"
                        class="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </span>
                  </div>
                  <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ item.input }}
                      </p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.output }}</p>
                    </div>
                    <div
                      class="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400 flex flex-col items-end gap-1"
                    >
                      <time [dateTime]="item.timestamp.toDate().toISOString()">{{
                        item.timestamp.toDate() | date : 'short'
                      }}</time>
                      <button
                        (click)="deleteEntry(item.id)"
                        class="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Elimina voce"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div
            *ngIf="(history$ | async)?.length === 0"
            class="text-center text-gray-500 dark:text-gray-400 py-4"
          >
            Nessuna attività recente.
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class DashboardComponent {
  private historyService = inject(HistoryService);
  history$ = this.historyService
    .getHistory()
    .pipe(map((items) => items as (HistoryEntry & { id: string })[]));

  async clearHistory() {
    if (!confirm('Sei sicuro di voler cancellare tutta la cronologia?')) return;
    await this.historyService.clearHistoryForCurrentUser();
  }

  async deleteEntry(id: string) {
    if (!confirm('Eliminare questa voce?')) return;
    await this.historyService.deleteEntry(id);
  }
}
