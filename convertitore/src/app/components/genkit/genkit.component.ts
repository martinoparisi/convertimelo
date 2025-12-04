import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConverterService } from '../../services/converter.service';
import { HistoryService } from '../../services/history.service';

/**
 * Component for AI content generation using Genkit (via Gemini API).
 * Allows users to input prompts and receive generated text.
 */
@Component({
  selector: 'app-genkit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2 class="card-title">Genkit AI Generator</h2>

      <div class="space-y-6">
        <div>
          <label class="form-label">Prompt</label>
          <textarea
            [(ngModel)]="prompt"
            rows="4"
            class="form-input"
            placeholder="Descrivi cosa vuoi generare..."
          ></textarea>
        </div>

        <button
          (click)="generate()"
          [disabled]="loading || !prompt"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <span *ngIf="loading">Generazione in corso...</span>
          <span *ngIf="!loading">Genera Contenuto</span>
        </button>

        <div *ngIf="result" class="mt-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Output Generato</label
          >
          <div
            class="mt-1 p-4 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white whitespace-pre-wrap"
          >
            {{ result }}
          </div>
        </div>

        <div
          *ngIf="error"
          class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md"
        >
          {{ error }}
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class GenkitComponent {
  private converterService = inject(ConverterService);
  private historyService = inject(HistoryService);

  prompt: string = '';
  result: string | null = null;
  loading = false;
  error: string | null = null;

  async generate() {
    if (!this.prompt) return;

    this.loading = true;
    this.error = null;
    this.result = null;

    try {
      const response = await this.converterService.generateContent(this.prompt);
      this.result = response.text;
      this.historyService.addEntry('genkit', this.prompt, this.result || '');
    } catch (err: any) {
      this.error = 'Generation failed. Please try again.';
      console.error(err);
    } finally {
      this.loading = false;
    }
  }
}
