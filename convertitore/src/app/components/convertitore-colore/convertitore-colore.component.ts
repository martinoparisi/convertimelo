import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HistoryService } from '../../services/history.service';

/**
 * Componente per la conversione di colori tra diversi formati (HEX, RGB, HSL, CMYK).
 * Include un selettore di colori visivo e conversione in tempo reale.
 */
@Component({
  selector: 'app-convertitore-colore',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2 class="card-title">Convertitore Colore</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Anteprima Colore & Selettore -->
        <div class="flex flex-col items-center justify-center space-y-4">
          <div class="relative w-64 h-64 group">
            <div
              class="w-full h-full rounded-full shadow-lg border-4 border-white dark:border-slate-700 transition-colors duration-200"
              [style.background-color]="valoreHex"
            ></div>
            <input
              type="color"
              [ngModel]="valoreHex"
              (ngModelChange)="aggiornaDaSelettore($event)"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
            />
            <div
              class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            >
              <svg
                class="w-12 h-12 text-white drop-shadow-md"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="space-y-6">
          <!-- HEX -->
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">HEX</label>
              <button
                (click)="copiaNegliAppunti(valoreHex, 'hex')"
                class="text-xs flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                <span *ngIf="campoCopiato !== 'hex'">
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
                  *ngIf="campoCopiato === 'hex'"
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
                </span>
              </button>
            </div>
            <div class="relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">#</span>
              </div>
              <input
                type="text"
                [(ngModel)]="inputHex"
                (ngModelChange)="aggiornaDaHex($event)"
                class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-slate-900/50 dark:text-white rounded-md p-2 border"
                placeholder="000000"
                maxlength="6"
              />
            </div>
          </div>

          <!-- RGB -->
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">RGB</label>
              <button
                (click)="
                  copiaNegliAppunti('rgb(' + valoreR + ', ' + valoreG + ', ' + valoreB + ')', 'rgb')
                "
                class="text-xs flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                <span *ngIf="campoCopiato !== 'rgb'">
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
                  *ngIf="campoCopiato === 'rgb'"
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
                </span>
              </button>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <div>
                <label class="text-xs text-gray-500 dark:text-gray-400">R</label>
                <input
                  type="number"
                  [(ngModel)]="valoreR"
                  (ngModelChange)="aggiornaDaRgb()"
                  min="0"
                  max="255"
                  class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-slate-900/50 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label class="text-xs text-gray-500 dark:text-gray-400">G</label>
                <input
                  type="number"
                  [(ngModel)]="valoreG"
                  (ngModelChange)="aggiornaDaRgb()"
                  min="0"
                  max="255"
                  class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-slate-900/50 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label class="text-xs text-gray-500 dark:text-gray-400">B</label>
                <input
                  type="number"
                  [(ngModel)]="valoreB"
                  (ngModelChange)="aggiornaDaRgb()"
                  min="0"
                  max="255"
                  class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-slate-900/50 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                />
              </div>
            </div>
          </div>

          <!-- HSL -->
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">HSL</label>
              <button
                (click)="
                  copiaNegliAppunti(
                    'hsl(' + valoreH + ', ' + valoreS + '%, ' + valoreL + '%)',
                    'hsl'
                  )
                "
                class="text-xs flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                <span *ngIf="campoCopiato !== 'hsl'">
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
                  *ngIf="campoCopiato === 'hsl'"
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
                </span>
              </button>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <div>
                <label class="text-xs text-gray-500 dark:text-gray-400">H</label>
                <input
                  type="number"
                  [(ngModel)]="valoreH"
                  (ngModelChange)="aggiornaDaHsl()"
                  min="0"
                  max="360"
                  class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-slate-900/50 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label class="text-xs text-gray-500 dark:text-gray-400">S (%)</label>
                <input
                  type="number"
                  [(ngModel)]="valoreS"
                  (ngModelChange)="aggiornaDaHsl()"
                  min="0"
                  max="100"
                  class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-slate-900/50 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label class="text-xs text-gray-500 dark:text-gray-400">L (%)</label>
                <input
                  type="number"
                  [(ngModel)]="valoreL"
                  (ngModelChange)="aggiornaDaHsl()"
                  min="0"
                  max="100"
                  class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-slate-900/50 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ConvertitoreColoreComponent {
  private historyService = inject(HistoryService);

  valoreHex: string = '#6366f1'; // Default Indigo-500
  inputHex: string = '6366f1';

  valoreR: number = 99;
  valoreG: number = 102;
  valoreB: number = 241;

  valoreH: number = 239;
  valoreS: number = 84;
  valoreL: number = 67;

  campoCopiato: string | null = null;

  aggiornaDaSelettore(hex: string) {
    this.valoreHex = hex;
    this.inputHex = hex.replace('#', '');
    this.aggiornaDaHex(this.inputHex);
  }

  copiaNegliAppunti(testo: string, campo: string) {
    navigator.clipboard.writeText(testo).then(() => {
      this.campoCopiato = campo;
      setTimeout(() => {
        this.campoCopiato = null;
      }, 2000);
    });
  }

  aggiornaDaHex(hex: string) {
    // Rimuovi # se presente
    hex = hex.replace('#', '');
    this.inputHex = hex;

    if (hex.length === 6) {
      this.valoreHex = '#' + hex;

      // Converti in RGB
      this.valoreR = parseInt(hex.substring(0, 2), 16);
      this.valoreG = parseInt(hex.substring(2, 4), 16);
      this.valoreB = parseInt(hex.substring(4, 6), 16);

      // Converti in HSL
      this.rgbAHsl(this.valoreR, this.valoreG, this.valoreB);
    }
  }

  aggiornaDaRgb() {
    // Limita i valori
    this.valoreR = Math.min(255, Math.max(0, this.valoreR || 0));
    this.valoreG = Math.min(255, Math.max(0, this.valoreG || 0));
    this.valoreB = Math.min(255, Math.max(0, this.valoreB || 0));

    // Converti in Hex
    const toHex = (n: number) => {
      const hex = n.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    this.inputHex = toHex(this.valoreR) + toHex(this.valoreG) + toHex(this.valoreB);
    this.valoreHex = '#' + this.inputHex;

    // Converti in HSL
    this.rgbAHsl(this.valoreR, this.valoreG, this.valoreB);
  }

  aggiornaDaHsl() {
    // Limita i valori
    this.valoreH = Math.min(360, Math.max(0, this.valoreH || 0));
    this.valoreS = Math.min(100, Math.max(0, this.valoreS || 0));
    this.valoreL = Math.min(100, Math.max(0, this.valoreL || 0));

    // Converti in RGB
    const s = this.valoreS / 100;
    const l = this.valoreL / 100;
    const k = (n: number) => (n + this.valoreH / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    this.valoreR = Math.round(255 * f(0));
    this.valoreG = Math.round(255 * f(8));
    this.valoreB = Math.round(255 * f(4));

    // Converti in Hex
    const toHex = (n: number) => {
      const hex = n.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    this.inputHex = toHex(this.valoreR) + toHex(this.valoreG) + toHex(this.valoreB);
    this.valoreHex = '#' + this.inputHex;
  }

  private rgbAHsl(r: number, g: number, b: number) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    this.valoreH = Math.round(h * 360);
    this.valoreS = Math.round(s * 100);
    this.valoreL = Math.round(l * 100);
  }
}
