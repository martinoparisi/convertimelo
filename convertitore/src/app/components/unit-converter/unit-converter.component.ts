import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConverterService } from '../../services/converter.service';
import { HistoryService } from '../../services/history.service';

/**
 * Component for unit conversion.
 * Supports Length, Weight, and Temperature conversions using PythonService.
 */
@Component({
  selector: 'app-unit-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2 class="card-title">Convertitore Unità</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div>
          <label class="form-label">Valore</label>
          <input type="number" [(ngModel)]="value" (ngModelChange)="convert()" class="form-input" />
        </div>

        <div>
          <label class="form-label">Da</label>
          <select [(ngModel)]="fromUnit" (ngModelChange)="convert()" class="form-select">
            <optgroup label="Lunghezza" class="bg-white dark:bg-slate-800">
              <option value="meter">Metri</option>
              <option value="kilometer">Chilometri</option>
              <option value="mile">Miglia</option>
              <option value="foot">Piedi</option>
              <option value="inch">Pollici</option>
            </optgroup>
            <optgroup label="Peso" class="bg-white dark:bg-slate-800">
              <option value="kilogram">Chilogrammi</option>
              <option value="gram">Grammi</option>
              <option value="pound">Libbre</option>
              <option value="ounce">Once</option>
            </optgroup>
            <optgroup label="Temperatura" class="bg-white dark:bg-slate-800">
              <option value="degC">Celsius</option>
              <option value="degF">Fahrenheit</option>
              <option value="kelvin">Kelvin</option>
            </optgroup>
          </select>
        </div>

        <div>
          <label class="form-label">A</label>
          <select [(ngModel)]="toUnit" (ngModelChange)="convert()" class="form-select">
            <optgroup label="Lunghezza" class="bg-white dark:bg-slate-800">
              <option value="meter">Metri</option>
              <option value="kilometer">Chilometri</option>
              <option value="mile">Miglia</option>
              <option value="foot">Piedi</option>
              <option value="inch">Pollici</option>
            </optgroup>
            <optgroup label="Peso" class="bg-white dark:bg-slate-800">
              <option value="kilogram">Chilogrammi</option>
              <option value="gram">Grammi</option>
              <option value="pound">Libbre</option>
              <option value="ounce">Once</option>
            </optgroup>
            <optgroup label="Temperatura" class="bg-white dark:bg-slate-800">
              <option value="degC">Celsius</option>
              <option value="degF">Fahrenheit</option>
              <option value="kelvin">Kelvin</option>
            </optgroup>
          </select>
        </div>
      </div>

      <div
        *ngIf="result !== null"
        class="mt-8 p-4 bg-gray-100 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-indigo-500/30 text-center"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400">Risultato</p>
        <p
          class="text-3xl font-bold text-gray-900 dark:text-white mt-1 drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]"
        >
          {{ result | number : '1.0-4' }}
          <span class="text-lg font-normal text-indigo-600 dark:text-indigo-300">{{
            resultUnit
          }}</span>
        </p>
      </div>

      <div
        *ngIf="error"
        class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md border border-red-200 dark:border-red-500/30"
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
            `${this.value} ${this.fromUnit}`,
            `${this.result} ${this.toUnit}`
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
