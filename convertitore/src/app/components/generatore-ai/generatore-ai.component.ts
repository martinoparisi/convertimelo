import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConverterService } from '../../services/converter.service';
import { HistoryService } from '../../services/history.service';

/**
 * Componente per la generazione di contenuti AI usando Genkit (via Gemini API).
 * Permette agli utenti di inserire prompt e ricevere testo generato.
 */
@Component({
  selector: 'app-generatore-ai',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2 class="card-title">Generatore AI Genkit</h2>

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
          (click)="genera()"
          [disabled]="caricamento || !prompt"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <span *ngIf="caricamento">Generazione in corso...</span>
          <span *ngIf="!caricamento">Genera Contenuto</span>
        </button>

        <div *ngIf="risultato" class="mt-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Output Generato</label
          >
          <div
            class="mt-1 p-4 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white whitespace-pre-wrap"
          >
            {{ risultato }}
          </div>
        </div>

        <div
          *ngIf="errore"
          class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md"
        >
          {{ errore }}
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class GeneratoreAIComponent {
  private converterService = inject(ConverterService);
  private historyService = inject(HistoryService);

  prompt: string = '';
  risultato: string | null = null;
  caricamento = false;
  errore: string | null = null;

  async genera() {
    if (!this.prompt) return;

    this.caricamento = true;
    this.errore = null;
    this.risultato = null;

    try {
      const response = await this.converterService.generateContent(this.prompt);
      this.risultato = response.text;
      this.historyService.addEntry('genkit', this.prompt, this.risultato || '');
    } catch (err: any) {
      this.errore = 'Generazione fallita. Riprova per favore.';
      console.error(err);
    } finally {
      this.caricamento = false;
    }
  }
}
