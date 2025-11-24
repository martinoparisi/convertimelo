import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConverterService } from '../../services/converter.service';
import { HistoryService } from '../../services/history.service';

@Component({
  selector: 'app-unit-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors duration-200">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Convertitore Unità</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Valore</label>
          <input type="number" [(ngModel)]="value" class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Da</label>
          <select [(ngModel)]="fromUnit" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border">
            <optgroup label="Lunghezza">
              <option value="meter">Metri</option>
              <option value="kilometer">Chilometri</option>
              <option value="mile">Miglia</option>
              <option value="foot">Piedi</option>
              <option value="inch">Pollici</option>
            </optgroup>
            <optgroup label="Peso">
              <option value="kilogram">Chilogrammi</option>
              <option value="gram">Grammi</option>
              <option value="pound">Libbre</option>
              <option value="ounce">Once</option>
            </optgroup>
            <optgroup label="Temperatura">
              <option value="degC">Celsius</option>
              <option value="degF">Fahrenheit</option>
              <option value="kelvin">Kelvin</option>
            </optgroup>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">A</label>
          <select [(ngModel)]="toUnit" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border">
            <optgroup label="Lunghezza">
              <option value="meter">Metri</option>
              <option value="kilometer">Chilometri</option>
              <option value="mile">Miglia</option>
              <option value="foot">Piedi</option>
              <option value="inch">Pollici</option>
            </optgroup>
            <optgroup label="Peso">
              <option value="kilogram">Chilogrammi</option>
              <option value="gram">Grammi</option>
              <option value="pound">Libbre</option>
              <option value="ounce">Once</option>
            </optgroup>
            <optgroup label="Temperatura">
              <option value="degC">Celsius</option>
              <option value="degF">Fahrenheit</option>
              <option value="kelvin">Kelvin</option>
            </optgroup>
          </select>
        </div>
      </div>

      <div class="mt-6">
        <button (click)="convert()" [disabled]="loading" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
          <span *ngIf="loading">Conversione in corso...</span>
          <span *ngIf="!loading">Converti</span>
        </button>
      </div>

      <div *ngIf="result !== null" class="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400">Risultato</p>
        <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">
          {{ result | number:'1.0-4' }} <span class="text-lg font-normal text-gray-600 dark:text-gray-300">{{ resultUnit }}</span>
        </p>
      </div>
      
      <div *ngIf="error" class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md">
        {{ error }}
      </div>
    </div>
  `,
  styles: []
})
export class UnitConverterComponent {
  private converterService = inject(ConverterService);
  private historyService = inject(HistoryService);

  value: number = 1;
  fromUnit: string = 'meter';
  toUnit: string = 'foot';

  result: number | null = null;
  resultUnit: string = '';
  loading = false;
  error: string | null = null;

  async convert() {
    this.loading = true;
    this.error = null;
    this.result = null;

    try {
      const response = await this.converterService.convertUnit(this.value, this.fromUnit, this.toUnit);
      this.result = response.result;
      this.resultUnit = this.toUnit;
      this.historyService.addEntry('unit', `Converted ${this.value} ${this.fromUnit} to ${this.toUnit}`);
    } catch (err: any) {
      this.error = 'Conversion failed. Please check your connection or inputs.';
      console.error(err);
    } finally {
      this.loading = false;
    }
  }
}
