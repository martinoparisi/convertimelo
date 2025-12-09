import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConverterService } from '../../services/converter.service';
import { HistoryService } from '../../services/history.service';

/**
 * Componente per la conversione di unità.
 * Supporta conversioni di Lunghezza, Peso e Temperatura usando PythonService.
 */
@Component({
  selector: 'app-convertitore-unita',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2 class="card-title">Convertitore Unità</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div>
          <label class="form-label">Valore</label>
          <input
            type="number"
            [(ngModel)]="valore"
            (ngModelChange)="converti()"
            class="form-input"
          />
        </div>

        <div>
          <label class="form-label">Da</label>
          <select [(ngModel)]="daUnita" (ngModelChange)="converti()" class="form-select">
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
          <select [(ngModel)]="aUnita" (ngModelChange)="converti()" class="form-select">
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
        *ngIf="risultato !== null"
        class="mt-8 p-4 bg-gray-100 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-indigo-500/30 text-center"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400">Risultato</p>
        <p
          class="text-3xl font-bold text-gray-900 dark:text-white mt-1 drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]"
        >
          {{ risultato | number : '1.0-4' }}
          <span class="text-lg font-normal text-indigo-600 dark:text-indigo-300">{{
            unitaRisultato
          }}</span>
        </p>
      </div>

      <div
        *ngIf="errore"
        class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md border border-red-200 dark:border-red-500/30"
      >
        {{ errore }}
      </div>
    </div>
  `,
  styles: [],
})
export class ConvertitoreUnitaComponent {
  private converterService = inject(ConverterService);
  private historyService = inject(HistoryService);

  valore: number = 1;
  daUnita: string = 'meter';
  aUnita: string = 'foot';

  risultato: number | null = null;
  unitaRisultato: string = '';
  caricamento = false;
  errore: string | null = null;

  // Timer per debounce
  private timerDebounce: any;

  constructor() {
    // Conversione iniziale
    this.converti();
  }

  async converti() {
    if (this.timerDebounce) clearTimeout(this.timerDebounce);

    this.timerDebounce = setTimeout(async () => {
      this.caricamento = true;
      this.errore = null;
      // Non resettare il risultato immediatamente per evitare sfarfallio

      try {
        const response = await this.converterService.convertUnit(
          this.valore,
          this.daUnita,
          this.aUnita
        );
        this.risultato = response.result;
        this.unitaRisultato = this.aUnita;

        // Salva conversione nella cronologia (HistoryService persisterà su Firestore quando l'utente è loggato)
        try {
          this.historyService.addEntry(
            'unit',
            `${this.valore} ${this.daUnita}`,
            `${this.risultato} ${this.aUnita}`
          );
        } catch (e) {
          console.warn('Impossibile aggiungere voce alla cronologia', e);
        }
      } catch (err: any) {
        this.errore = 'Conversione fallita.';
        console.error(err);
      } finally {
        this.caricamento = false;
      }
    }, 500); // 500ms debounce
  }
}
