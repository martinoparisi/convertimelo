import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConverterService } from '../../services/converter.service';
import { HistoryService } from '../../services/history.service';
import { marked } from 'marked';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

/**
 * Componente per l'analisi e la generazione di codice.
 * Usa l'IA per spiegare il codice, rilevare il linguaggio e generare codice da prompt.
 */
@Component({
  selector: 'app-assistente-codice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2 class="card-title">Assistente Codice</h2>

      <div class="space-y-6">
        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="form-label">Input (Codice o Richiesta)</label>
            <div class="flex items-center gap-2">
              <span
                *ngIf="rilevamentoInCorso"
                class="text-xs text-gray-500 dark:text-gray-400 animate-pulse"
              >
                Rilevamento linguaggio...
              </span>
              <span
                *ngIf="linguaggioRilevato"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700"
              >
                {{ linguaggioRilevato }}
              </span>
            </div>
          </div>
          <textarea
            [(ngModel)]="testoInput"
            (ngModelChange)="alCambioInput($event)"
            rows="6"
            class="form-input font-mono"
            placeholder="Incolla qui il tuo codice per spiegarlo/rilevare il linguaggio, o scrivi una richiesta per generare codice..."
          ></textarea>
        </div>

        <div class="flex flex-wrap justify-center gap-3">
          <button
            (click)="spiegaCodice()"
            class="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]"
          >
            🔍 Spiega Codice
          </button>
          <button
            (click)="generaCodice()"
            class="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all shadow-[0_0_10px_rgba(236,72,153,0.3)] hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]"
          >
            ✨ Genera Codice
          </button>
        </div>

        <div *ngIf="caricamento" class="text-center text-gray-500 dark:text-gray-400">
          Elaborazione in corso...
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
            class="p-4 bg-gray-100 dark:bg-slate-900/50 rounded-md border border-gray-200 dark:border-indigo-500/30 text-gray-900 dark:text-white overflow-x-auto prose dark:prose-invert max-w-none"
            [innerHTML]="risultatoParsato"
          ></div>
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
export class AssistenteCodiceComponent implements OnInit, OnDestroy {
  private converterService = inject(ConverterService);
  private historyService = inject(HistoryService);

  testoInput: string = '';
  risultato: any = null;
  risultatoParsato: string = '';
  caricamento = false;
  errore: string | null = null;
  copiato = false;

  linguaggioRilevato: string | null = null;
  rilevamentoInCorso = false;
  private soggettoInput = new Subject<string>();
  private sottoscrizione: Subscription | null = null;

  ngOnInit() {
    this.sottoscrizione = this.soggettoInput
      .pipe(
        debounceTime(1000), // Aspetta 1s dopo che la digitazione si ferma
        distinctUntilChanged(),
        filter((testo) => testo.length > 10) // Rileva solo se il testo è abbastanza lungo
      )
      .subscribe((testo) => {
        this.rilevaLinguaggioInTempoReale(testo);
      });
  }

  ngOnDestroy() {
    this.sottoscrizione?.unsubscribe();
  }

  alCambioInput(testo: string) {
    this.soggettoInput.next(testo);
    if (testo.length <= 10) {
      this.linguaggioRilevato = null;
    }
  }

  async rilevaLinguaggioInTempoReale(testo: string) {
    this.rilevamentoInCorso = true;
    try {
      const prompt = `Identifica il linguaggio di programmazione del seguente codice. Rispondi SOLO con il nome del linguaggio (es. "Python", "JavaScript", "C++"). Se non è codice, rispondi con "Testo".\n\nCodice:\n${testo}`;
      const resp: any = await this.converterService.generateContent(prompt);
      const lang = resp.text ?? resp.result ?? resp.output ?? JSON.stringify(resp);
      this.linguaggioRilevato = lang.trim();
    } catch (e) {
      console.error('Rilevamento linguaggio fallito', e);
    } finally {
      this.rilevamentoInCorso = false;
    }
  }

  async elaboraConIA(prompt: string, nomeOperazione: string) {
    if (!this.testoInput) return;

    this.caricamento = true;
    this.errore = null;
    this.risultato = null;
    this.risultatoParsato = '';

    try {
      const resp: any = await this.converterService.generateContent(prompt);
      this.risultato = resp.text ?? resp.result ?? resp.output ?? JSON.stringify(resp);

      // Parsa markdown
      const parsed = await marked.parse(this.risultato);
      this.risultatoParsato = parsed;

      this.historyService.addEntry('code', nomeOperazione, this.risultato || '');
    } catch (err: any) {
      console.error(`Errore ${nomeOperazione}:`, err);
      this.errore = 'Si è verificato un errore. Controlla la tua chiave API o la connessione.';
      if (err.error?.error?.message) {
        this.errore += ` (${err.error.error.message})`;
      }
    } finally {
      this.caricamento = false;
    }
  }

  spiegaCodice() {
    const prompt = `Spiega il seguente codice in dettaglio. Descrivi cosa fa, la sua logica e eventuali problemi potenziali. Rispondi in Italiano.\n\nCodice:\n${this.testoInput}`;
    this.elaboraConIA(prompt, 'Spiegazione Codice');
  }

  generaCodice() {
    const prompt = `Genera codice basato sulla seguente descrizione. Fornisci SOLO il codice, con commenti se necessario, ma nessun testo conversazionale. Usa commenti in italiano.\n\nDescrizione:\n${this.testoInput}`;
    this.elaboraConIA(prompt, 'Generazione Codice');
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
