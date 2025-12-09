import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConverterService } from '../../services/converter.service';
import { HistoryService } from '../../services/history.service';

/**
 * Componente per la manipolazione del testo.
 * Offre operazioni di base (maiuscolo, minuscolo, inversione) e funzionalità AI (riassunto, miglioramento).
 */
@Component({
  selector: 'app-manipolatore-testo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2 class="card-title">Manipolatore di Testo</h2>

      <div class="space-y-6">
        <div>
          <label class="form-label">Testo di Input</label>
          <textarea
            [(ngModel)]="testoInput"
            rows="4"
            class="form-input"
            placeholder="Inserisci il testo qui..."
          ></textarea>
        </div>

        <div class="flex flex-col gap-3">
          <div class="flex flex-wrap justify-center gap-2">
            <button (click)="manipola('uppercase')" class="btn-secondary">ABC</button>
            <button (click)="manipola('lowercase')" class="btn-secondary">abc</button>
            <button (click)="manipola('reverse')" class="btn-secondary">cbA</button>
          </div>
          <div class="flex flex-wrap justify-center gap-2">
            <button (click)="manipola('word_count')" class="btn-secondary px-3 py-1.5">
              Conta parole
            </button>
            <button (click)="manipola('char_count')" class="btn-secondary px-3 py-1.5">
              Conta caratteri
            </button>
          </div>
          <div class="flex flex-wrap justify-center gap-2">
            <button (click)="riassumi()" class="btn-primary">✨ Riassunto AI</button>
            <button (click)="miglioraTesto()" class="btn-primary">🚀 AI Text Enhancer</button>
          </div>
        </div>

        <div *ngIf="caricamento" class="text-center text-gray-500 dark:text-gray-400">
          Elaborazione...
        </div>

        <div *ngIf="risultato !== null && !caricamento" class="mt-6">
          <div class="flex justify-between items-center mb-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Risultato</label
            >
            <button
              (click)="copiaRisultato()"
              class="text-xs flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
            >
              <span *ngIf="!copiato">
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
                *ngIf="copiato"
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
              <span *ngIf="!copiato">Copia</span>
            </button>
          </div>
          <div
            class="p-4 bg-gray-100 dark:bg-slate-900/50 rounded-md border border-gray-200 dark:border-indigo-500/30 text-gray-900 dark:text-white whitespace-pre-wrap"
          >
            {{ risultato }}
          </div>
        </div>

        <div
          *ngIf="errore"
          class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md border border-red-200 dark:border-red-500/30"
        >
          {{ errore }}
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ManipolatoreTestoComponent {
  private converterService = inject(ConverterService);
  private historyService = inject(HistoryService);

  testoInput: string = '';
  risultato: any = null;
  caricamento = false;
  errore: string | null = null;
  copiato = false;

  async manipola(operazione: string) {
    if (!this.testoInput) return;

    this.caricamento = true;
    this.errore = null;
    this.risultato = null;

    try {
      const response = await this.converterService.manipulateText(this.testoInput, operazione);
      this.risultato = response.result;
      this.historyService.addEntry(
        'text',
        `Operazione: ${operazione}`,
        this.risultato || ''
      );
    } catch (err: any) {
      this.errore = 'Operazione fallita. Riprova.';
      console.error(err);
    } finally {
      this.caricamento = false;
    }
  }

  async riassumi() {
    if (!this.testoInput) return;

    this.caricamento = true;
    this.errore = null;
    this.risultato = null;

    try {
      const prompt = `Riassumi il seguente testo in italiano. Rispondi SOLO con il riassunto, senza preamboli come "Ecco il riassunto" o "Certamente".\n\nTesto:\n${this.testoInput}`;
      const resp: any = await this.converterService.generateContent(prompt);
      this.risultato = resp.text ?? resp.result ?? resp.output ?? JSON.stringify(resp);
      this.historyService.addEntry(
        'text',
        'Riassunto AI',
        this.risultato || ''
      );
      this.caricamento = false;
    } catch (err: any) {
      console.error('Errore riassunto:', err);
      this.errore =
        'Errore durante la generazione del riassunto. Verifica la chiave API o la connessione.';
      if (err.error?.error?.message) {
        this.errore += ` (${err.error.error.message})`;
      }
      this.caricamento = false;
    }
  }

  async miglioraTesto() {
    if (!this.testoInput) return;

    this.caricamento = true;
    this.errore = null;
    this.risultato = null;

    try {
      const prompt = `Migliora il seguente testo in italiano, correggendo la grammatica e rendendolo più professionale e fluido. Rispondi SOLO con il testo migliorato, senza commenti aggiuntivi.\n\nTesto:\n${this.testoInput}`;
      const resp: any = await this.converterService.generateContent(prompt);
      this.risultato = resp.text ?? resp.result ?? resp.output ?? JSON.stringify(resp);
      this.historyService.addEntry(
        'text',
        'Miglioramento AI',
        this.risultato || ''
      );
      this.caricamento = false;
    } catch (err: any) {
      console.error('Errore miglioramento:', err);
      this.errore =
        'Errore durante il miglioramento del testo. Verifica la chiave API o la connessione.';
      if (err.error?.error?.message) {
        this.errore += ` (${err.error.error.message})`;
      }
      this.caricamento = false;
    }
  }

  copiaRisultato() {
    if (this.risultato) {
      navigator.clipboard.writeText(this.risultato).then(() => {
        this.copiato = true;
        setTimeout(() => {
          this.copiato = false;
        }, 2000);
      });
    }
  }
}
