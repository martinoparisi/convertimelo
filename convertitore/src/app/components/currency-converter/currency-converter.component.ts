import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConverterService } from '../../services/converter.service';
import { HistoryService } from '../../services/history.service';

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors duration-200">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Convertitore Valuta</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Importo</label>
          <input type="number" [(ngModel)]="amount" (ngModelChange)="convert()" class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Da</label>
          <select [(ngModel)]="fromCurrency" (ngModelChange)="onFromCurrencyChange()" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border">
            <option *ngFor="let currency of currencies" [value]="currency">{{ currency }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">A</label>
          <select [(ngModel)]="toCurrency" (ngModelChange)="convert()" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border">
            <option *ngFor="let currency of currencies" [value]="currency">{{ currency }}</option>
          </select>
        </div>
      </div>

      <div class="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-center">
        <div *ngIf="loading" class="text-gray-500 dark:text-gray-400">Caricamento tassi...</div>
        <div *ngIf="!loading && result !== null">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            1 {{ fromCurrency }} = {{ rate | number:'1.2-4' }} {{ toCurrency }}
          </p>
          <p class="text-4xl font-bold text-gray-900 dark:text-white mt-2">
            {{ result | number:'1.2-2' }} <span class="text-xl font-normal text-gray-600 dark:text-gray-300">{{ toCurrency }}</span>
          </p>
          <p class="text-xs text-gray-400 mt-2">Ultimo aggiornamento: {{ lastUpdated | date:'medium' }}</p>
        </div>
        <div *ngIf="error" class="text-red-600 dark:text-red-400">{{ error }}</div>
      </div>
    </div>
  `,
  styles: []
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
      this.historyService.addEntry('currency', `Converted ${this.amount} ${this.fromCurrency} to ${this.toCurrency}`);
    }
  }
}
