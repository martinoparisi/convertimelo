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
    <div
      class="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-indigo-500/20 rounded-lg p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(79,70,229,0.15)]"
    >
      <h2
        class="text-2xl font-bold text-gray-900 dark:text-white mb-6 drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]"
      >
        Manipolatore di Testo
      </h2>

      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Testo di Input</label
          >
          <textarea
            [(ngModel)]="inputText"
            rows="4"
            class="mt-1 block w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900/50 text-gray-900 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Inserisci il testo qui..."
          ></textarea>
        </div>

        <div class="flex flex-col gap-3">
          <div class="flex flex-wrap justify-center gap-2">
            <button
              (click)="manipulate('uppercase')"
              class="inline-flex justify-center items-center px-2 py-1 border border-gray-300 dark:border-indigo-500/30 shadow-sm text-xs font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              ABC
            </button>
            <button
              (click)="manipulate('lowercase')"
              class="inline-flex justify-center items-center px-2 py-1 border border-gray-300 dark:border-indigo-500/30 shadow-sm text-xs font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              abc
            </button>
            <button
              (click)="manipulate('reverse')"
              class="inline-flex justify-center items-center px-2 py-1 border border-gray-300 dark:border-indigo-500/30 shadow-sm text-xs font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              cbA
            </button>
          </div>
          <div class="flex flex-wrap justify-center gap-2">
            <button
              (click)="manipulate('word_count')"
              class="inline-flex justify-center items-center px-3 py-1.5 border border-gray-300 dark:border-indigo-500/30 shadow-sm text-xs font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Conta parole
            </button>
            <button
              (click)="manipulate('char_count')"
              class="inline-flex justify-center items-center px-3 py-1.5 border border-gray-300 dark:border-indigo-500/30 shadow-sm text-xs font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Conta caratteri
            </button>
          </div>
          <div class="flex flex-wrap justify-center gap-2">
            <button
              (click)="summarize()"
              class="inline-flex justify-center items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-[0_0_10px_rgba(139,92,246,0.3)] hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]"
            >
              ✨ Riassunto AI
            </button>
            <button
              (click)="enhanceText()"
              class="inline-flex justify-center items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-[0_0_10px_rgba(139,92,246,0.3)] hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]"
            >
              🚀 AI Text Enhancer
            </button>
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
