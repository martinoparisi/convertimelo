import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConverterService } from '../../services/converter.service';
import { HistoryService } from '../../services/history.service';

@Component({
  selector: 'app-text-manipulator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors duration-200">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manipolatore di Testo</h2>
      
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Testo di Input</label>
          <textarea [(ngModel)]="inputText" rows="4" class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border" placeholder="Inserisci il testo qui..."></textarea>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <button (click)="manipulate('uppercase')" class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Maiuscolo
          </button>
          <button (click)="manipulate('lowercase')" class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Minuscolo
          </button>
          <button (click)="manipulate('reverse')" class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Inverti
          </button>
          <button (click)="manipulate('word_count')" class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Conta Parole
          </button>
          <button (click)="manipulate('char_count')" class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Conta Caratteri
          </button>
        </div>

        <div *ngIf="loading" class="text-center text-gray-500 dark:text-gray-400">Elaborazione...</div>

        <div *ngIf="result !== null && !loading" class="mt-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Risultato</label>
          <div class="mt-1 p-4 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white whitespace-pre-wrap">
            {{ result }}
          </div>
        </div>

        <div *ngIf="error" class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md">
          {{ error }}
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class TextManipulatorComponent {
  private converterService = inject(ConverterService);
  private historyService = inject(HistoryService);

  inputText: string = '';
  result: any = null;
  loading = false;
  error: string | null = null;

  async manipulate(operation: string) {
    if (!this.inputText) return;

    this.loading = true;
    this.error = null;
    this.result = null;

    try {
      const response = await this.converterService.manipulateText(this.inputText, operation);
      this.result = response.result;
      this.historyService.addEntry('text', `Manipulated text: ${operation}`);
    } catch (err: any) {
      this.error = 'Operation failed. Please try again.';
      console.error(err);
    } finally {
      this.loading = false;
    }
  }
}
