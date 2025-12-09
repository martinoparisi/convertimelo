import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConverterService } from '../../services/converter.service';
import { HistoryService } from '../../services/history.service';

/**
 * Componente per la conversione di valuta.
 * Recupera i tassi di cambio ed esegue conversioni tra le valute selezionate.
 */
@Component({
  selector: 'app-convertitore-valuta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2 class="card-title">Convertitore Valuta</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div>
          <label class="form-label">Importo</label>
          <input
            type="number"
            [(ngModel)]="importo"
            (ngModelChange)="converti()"
            class="form-input"
          />
        </div>

        <div>
          <label class="form-label">Da</label>
          <select [(ngModel)]="daValuta" (ngModelChange)="suCambioDaValuta()" class="form-select">
            <option
              *ngFor="let valuta of valute"
              [value]="valuta"
              class="bg-white dark:bg-slate-800"
            >
              {{ valuta }}
            </option>
          </select>
        </div>

        <div>
          <label class="form-label">A</label>
          <select [(ngModel)]="aValuta" (ngModelChange)="converti()" class="form-select">
            <option
              *ngFor="let valuta of valute"
              [value]="valuta"
              class="bg-white dark:bg-slate-800"
            >
              {{ valuta }}
            </option>
          </select>
        </div>
      </div>

      <div
        class="mt-8 p-6 bg-gray-100 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-indigo-500/30 text-center"
      >
        <div *ngIf="caricamento" class="text-gray-500 dark:text-gray-400">Caricamento tassi...</div>
        <div *ngIf="!caricamento && risultato !== null">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            1 {{ daValuta }} = {{ tasso | number : '1.2-4' }} {{ aValuta }}
          </p>
          <p
            class="text-4xl font-bold text-gray-900 dark:text-white mt-2 drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]"
          >
            {{ risultato | number : '1.2-2' }}
            <span class="text-xl font-normal text-indigo-600 dark:text-indigo-300">{{
              aValuta
            }}</span>
          </p>
          <p class="text-xs text-gray-500 mt-2">
            Ultimo aggiornamento: {{ ultimoAggiornamento | date : 'medium' }}
          </p>
        </div>
        <div *ngIf="errore" class="text-red-600 dark:text-red-400">{{ errore }}</div>
      </div>
    </div>
  `,
  styles: [],
})
export class ConvertitoreValutaComponent implements OnInit {
  private converterService = inject(ConverterService);
  private historyService = inject(HistoryService);

  importo: number = 1;
  daValuta: string = 'USD';
  aValuta: string = 'EUR';
  valute: string[] = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'SEK', 'NZD'];
  tassi: { [key: string]: number } = {};
  risultato: number | null = null;
  tasso: number = 0;
  ultimoAggiornamento: Date | null = null;
  caricamento = false;
  errore: string | null = null;

  ngOnInit() {
    this.caricaTassi();
  }

  async caricaTassi() {
    this.caricamento = true;
    this.errore = null;
    try {
      const data = await this.converterService.getExchangeRates(this.daValuta);
      this.tassi = data.rates;
      this.ultimoAggiornamento = new Date(data.time_last_update_utc);
      this.converti();
    } catch (err) {
      this.errore = 'Impossibile caricare i tassi di cambio.';
      console.error(err);
    } finally {
      this.caricamento = false;
    }
  }

  suCambioDaValuta() {
    this.caricaTassi();
  }

  converti() {
    if (this.tassi[this.aValuta]) {
      this.tasso = this.tassi[this.aValuta];
      this.risultato = this.importo * this.tasso;
      this.historyService.addEntry(
        'currency',
        `${this.importo} ${this.daValuta} a ${this.aValuta}`,
        `${this.risultato.toFixed(2)} ${this.aValuta}`
      );
    }
  }
}
