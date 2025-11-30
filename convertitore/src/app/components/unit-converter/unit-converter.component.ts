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
          <input
            type="number"
            [(ngModel)]="value"
            (ngModelChange)="convert()"
            class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Da</label>
          <select
            [(ngModel)]="fromUnit"
            (ngModelChange)="convert()"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
          >
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
          <select
            [(ngModel)]="toUnit"
            (ngModelChange)="convert()"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
          >
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

      <!-- Button removed for instant conversion -->

      <div
        *ngIf="result !== null"
        class="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-center"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400">Risultato</p>
        <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">
          {{ result | number : '1.0-4' }}
          <span class="text-lg font-normal text-gray-600 dark:text-gray-300">{{ resultUnit }}</span>
        </p>
      </div>

      <div
        *ngIf="error"
        class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md"
      >
        {{ error }}
      </div>
    </div>
  `,
  styles: [],
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

  // Debounce timer
  private debounceTimer: any;

  constructor() {
    // Initial conversion
    this.convert();
  }

  async convert() {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(async () => {
      this.loading = true;
      this.error = null;
      // Don't reset result immediately to avoid flickering

      try {
        const response = await this.converterService.convertUnit(
          this.value,
          this.fromUnit,
          this.toUnit
        );
        this.result = response.result;
        this.resultUnit = this.toUnit;

        // Only add to history if it's a deliberate action?
        // For instant conversion, adding every keystroke to history is bad.
        // Maybe add to history only after a delay or not at all for instant?
        // Let's skip history for instant updates to avoid spamming DB.
        // Or maybe add a "Save" button?
        // The user requirement said "save conversions... EXCEPT FOR FILES".
        // I will implement a debounce for history saving or just save the last one when leaving component?
        // For now, I'll comment out history saving on every keystroke.
        // Save conversion to history (HistoryService will persist to Firestore when user logged in)
        try {
          this.historyService.addEntry(
            'unit',
            JSON.stringify({
              value: this.value,
              from: this.fromUnit,
              to: this.toUnit,
              result: this.result,
            })
          );
        } catch (e) {
          console.warn('Could not add history entry', e);
        }
      } catch (err: any) {
        this.error = 'Conversion failed.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    }, 500); // 500ms debounce
  }
}
