import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConverterService } from '../../services/converter.service';
import { HistoryService } from '../../services/history.service';

/**
 * Component for currency conversion.
 * Fetches exchange rates and performs conversions between selected currencies.
 */
@Component({
  selector: 'app-currency-converter',
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
            [(ngModel)]="amount"
            (ngModelChange)="convert()"
            class="form-input"
          />
        </div>

        <div>
          <label class="form-label">Da</label>
          <select
            [(ngModel)]="fromCurrency"
            (ngModelChange)="onFromCurrencyChange()"
            class="form-select"
          >
            <option
              *ngFor="let currency of currencies"
              [value]="currency"
              class="bg-white dark:bg-slate-800"
            >
              {{ currency }}
            </option>
          </select>
        </div>

        <div>
          <label class="form-label">A</label>
          <select [(ngModel)]="toCurrency" (ngModelChange)="convert()" class="form-select">
            <option
              *ngFor="let currency of currencies"
              [value]="currency"
              class="bg-white dark:bg-slate-800"
            >
              {{ currency }}
            </option>
          </select>
        </div>
      </div>

      <div
        class="mt-8 p-6 bg-gray-100 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-indigo-500/30 text-center"
      >
        <div *ngIf="loading" class="text-gray-500 dark:text-gray-400">Caricamento tassi...</div>
        <div *ngIf="!loading && result !== null">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            1 {{ fromCurrency }} = {{ rate | number : '1.2-4' }} {{ toCurrency }}
          </p>
          <p
            class="text-4xl font-bold text-gray-900 dark:text-white mt-2 drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]"
          >
            {{ result | number : '1.2-2' }}
            <span class="text-xl font-normal text-indigo-600 dark:text-indigo-300">{{
              toCurrency
            }}</span>
          </p>
          <p class="text-xs text-gray-500 mt-2">
            Ultimo aggiornamento: {{ lastUpdated | date : 'medium' }}
          </p>
        </div>
        <div *ngIf="error" class="text-red-600 dark:text-red-400">{{ error }}</div>
      </div>
    </div>
  `,
  styles: [],
})
export class CurrencyConverterComponent implements OnInit {
  private converterService = inject(ConverterService);
  private historyService = inject(HistoryService);

  amount: number = 1;
  fromCurrency: string = 'USD';
  toCurrency: string = 'EUR';
  currencies: string[] = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'SEK', 'NZD'];
  rates: { [key: string]: number } = {};
  result: number | null = null;
  rate: number = 0;
  lastUpdated: Date | null = null;
  loading = false;
  error: string | null = null;

  ngOnInit() {
    this.fetchRates();
  }

  async fetchRates() {
    this.loading = true;
    this.error = null;
    try {
      const data = await this.converterService.getExchangeRates(this.fromCurrency);
      this.rates = data.rates;
      this.lastUpdated = new Date(data.time_last_updated * 1000); // API returns unix timestamp

      // Update available currencies if needed, or just keep static list
      // this.currencies = Object.keys(this.rates);

      this.convert();
    } catch (err) {
      this.error = 'Failed to load exchange rates.';
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  onFromCurrencyChange() {
    this.fetchRates(); // Need to fetch new base rates
  }

  convert() {
    if (this.rates[this.toCurrency]) {
      this.rate = this.rates[this.toCurrency];
      this.result = this.amount * this.rate;
      this.historyService.addEntry(
        'currency',
        `${this.amount} ${this.fromCurrency}`,
        `${this.result?.toFixed(2)} ${this.toCurrency}`
      );
    }
  }
}
