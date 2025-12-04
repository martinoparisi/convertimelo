import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConverterService } from '../../services/converter.service';
import { HistoryService } from '../../services/history.service';

/**
 * Component for text manipulation.
 * Offers basic operations (uppercase, lowercase, reverse) and AI-powered features (summarization, enhancement).
 */
@Component({
  selector: 'app-text-manipulator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2 class="card-title">Manipolatore di Testo</h2>

      <div class="space-y-6">
        <div>
          <label class="form-label">Testo di Input</label>
          <textarea
            [(ngModel)]="inputText"
            rows="4"
            class="form-input"
            placeholder="Inserisci il testo qui..."
          ></textarea>
        </div>

        <div class="flex flex-col gap-3">
          <div class="flex flex-wrap justify-center gap-2">
            <button (click)="manipulate('uppercase')" class="btn-secondary">ABC</button>
            <button (click)="manipulate('lowercase')" class="btn-secondary">abc</button>
            <button (click)="manipulate('reverse')" class="btn-secondary">cbA</button>
          </div>
          <div class="flex flex-wrap justify-center gap-2">
            <button (click)="manipulate('word_count')" class="btn-secondary px-3 py-1.5">
              Conta parole
            </button>
            <button (click)="manipulate('char_count')" class="btn-secondary px-3 py-1.5">
              Conta caratteri
            </button>
          </div>
          <div class="flex flex-wrap justify-center gap-2">
            <button (click)="summarize()" class="btn-primary">✨ Riassunto AI</button>
            <button (click)="enhanceText()" class="btn-primary">🚀 AI Text Enhancer</button>
          </div>
        </div>

        <div *ngIf="loading" class="text-center text-gray-500 dark:text-gray-400">
          Elaborazione...
        </div>

        <div *ngIf="result !== null && !loading" class="mt-6">
          <div class="flex justify-between items-center mb-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Risultato</label
            >
            <button
              (click)="copyResult()"
              class="text-xs flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
            >
              <span *ngIf="!copied">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  ></path>
                </svg>
              </span>
              <span
                *ngIf="copied"
                class="flex items-center gap-1 text-green-600 dark:text-green-400"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Copiato!
              </span>
              <span *ngIf="!copied">Copia</span>
            </button>
          </div>
          <div
            class="p-4 bg-gray-100 dark:bg-slate-900/50 rounded-md border border-gray-200 dark:border-indigo-500/30 text-gray-900 dark:text-white whitespace-pre-wrap"
          >
            {{ result }}
          </div>
        </div>

        <div
          *ngIf="error"
          class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md border border-red-200 dark:border-red-500/30"
        >
          {{ error }}
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class TextManipulatorComponent {
  private converterService = inject(ConverterService);
  private historyService = inject(HistoryService);

  inputText: string = '';
  result: any = null;
  loading = false;
  error: string | null = null;
  copied = false;

  async manipulate(operation: string) {
    if (!this.inputText) return;

    this.loading = true;
    this.error = null;
    this.result = null;

    try {
      const response = await this.converterService.manipulateText(this.inputText, operation);
      this.result = response.result;
      this.historyService.addEntry('text', `Operation: ${operation}`, this.result || '');
    } catch (err: any) {
      this.error = 'Operation failed. Please try again.';
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  async summarize() {
    if (!this.inputText) return;

    this.loading = true;
    this.error = null;
    this.result = null;

    try {
      const prompt = `Riassumi il seguente testo in italiano. Rispondi SOLO con il riassunto, senza preamboli come "Ecco il riassunto" o "Certamente".\n\nTesto:\n${this.inputText}`;
      const resp: any = await this.converterService.generateContent(prompt);
      this.result = resp.text ?? resp.result ?? resp.output ?? JSON.stringify(resp);
      this.historyService.addEntry('text', 'AI Summary', this.result || '');
      this.loading = false;
    } catch (err: any) {
      console.error('Summary error:', err);
      this.error =
        'Errore durante la generazione del riassunto. Verifica la chiave API o la connessione.';
      if (err.error?.error?.message) {
        this.error += ` (${err.error.error.message})`;
      }
      this.loading = false;
    }
  }

  async enhanceText() {
    if (!this.inputText) return;

    this.loading = true;
    this.error = null;
    this.result = null;

    try {
      const prompt = `Migliora il seguente testo in italiano, correggendo la grammatica e rendendolo più professionale e fluido. Rispondi SOLO con il testo migliorato, senza commenti aggiuntivi.\n\nTesto:\n${this.inputText}`;
      const resp: any = await this.converterService.generateContent(prompt);
      this.result = resp.text ?? resp.result ?? resp.output ?? JSON.stringify(resp);
      this.historyService.addEntry('text', 'AI Enhancement', this.result || '');
      this.loading = false;
    } catch (err: any) {
      console.error('Enhancement error:', err);
      this.error =
        'Errore durante il miglioramento del testo. Verifica la chiave API o la connessione.';
      if (err.error?.error?.message) {
        this.error += ` (${err.error.error.message})`;
      }
      this.loading = false;
    }
  }

  copyResult() {
    if (this.result) {
      navigator.clipboard.writeText(this.result).then(() => {
        this.copied = true;
        setTimeout(() => {
          this.copied = false;
        }, 2000);
      });
    }
  }
}
