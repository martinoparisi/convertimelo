import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistoryService } from '../../services/history.service';

/**
 * Component for converting colors between different formats (HEX, RGB, HSL, CMYK).
 * Includes a visual color picker and real-time conversion.
 */
@Component({
  selector: 'app-color-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2 class="card-title">Convertitore Colore</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Color Preview & Picker -->
        <div class="flex flex-col items-center justify-center space-y-4">
          <div class="relative w-64 h-64 group">
            <div
              class="w-full h-full rounded-full shadow-lg border-4 border-white dark:border-slate-700 transition-colors duration-200"
              [style.background-color]="hexValue"
            ></div>
            <input
              type="color"
              [ngModel]="hexValue"
              (ngModelChange)="updateFromPicker($event)"
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

        <!-- Inputs -->
        <div class="space-y-6">
          <!-- HEX -->
          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">HEX</label>
              <button
                (click)="copyToClipboard(hexValue, 'hex')"
                class="text-xs flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                <span *ngIf="copiedField !== 'hex'">
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
                  *ngIf="copiedField === 'hex'"
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
                [(ngModel)]="hexInput"
                (ngModelChange)="updateFromHex($event)"
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
                  copyToClipboard('rgb(' + rValue + ', ' + gValue + ', ' + bValue + ')', 'rgb')
                "
                class="text-xs flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                <span *ngIf="copiedField !== 'rgb'">
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
                  *ngIf="copiedField === 'rgb'"
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
                  [(ngModel)]="rValue"
                  (ngModelChange)="updateFromRgb()"
                  min="0"
                  max="255"
                  class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-slate-900/50 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label class="text-xs text-gray-500 dark:text-gray-400">G</label>
                <input
                  type="number"
                  [(ngModel)]="gValue"
                  (ngModelChange)="updateFromRgb()"
                  min="0"
                  max="255"
                  class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-slate-900/50 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label class="text-xs text-gray-500 dark:text-gray-400">B</label>
                <input
                  type="number"
                  [(ngModel)]="bValue"
                  (ngModelChange)="updateFromRgb()"
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
                  copyToClipboard('hsl(' + hValue + ', ' + sValue + '%, ' + lValue + '%)', 'hsl')
                "
                class="text-xs flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                <span *ngIf="copiedField !== 'hsl'">
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
                  *ngIf="copiedField === 'hsl'"
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
                  [(ngModel)]="hValue"
                  (ngModelChange)="updateFromHsl()"
                  min="0"
                  max="360"
                  class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-slate-900/50 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label class="text-xs text-gray-500 dark:text-gray-400">S (%)</label>
                <input
                  type="number"
                  [(ngModel)]="sValue"
                  (ngModelChange)="updateFromHsl()"
                  min="0"
                  max="100"
                  class="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-slate-900/50 dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label class="text-xs text-gray-500 dark:text-gray-400">L (%)</label>
                <input
                  type="number"
                  [(ngModel)]="lValue"
                  (ngModelChange)="updateFromHsl()"
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
export class ColorConverterComponent {
  private historyService = inject(HistoryService);

  hexValue: string = '#6366f1'; // Default Indigo-500
  hexInput: string = '6366f1';

  rValue: number = 99;
  gValue: number = 102;
  bValue: number = 241;

  hValue: number = 239;
  sValue: number = 84;
  lValue: number = 67;

  copiedField: string | null = null;

  updateFromPicker(hex: string) {
    this.hexValue = hex;
    this.hexInput = hex.replace('#', '');
    this.updateFromHex(this.hexInput);
  }

  copyToClipboard(text: string, field: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.copiedField = field;
      setTimeout(() => {
        this.copiedField = null;
      }, 2000);
    });
  }

  updateFromHex(hex: string) {
    // Remove # if present
    hex = hex.replace('#', '');
    this.hexInput = hex;

    if (hex.length === 6) {
      this.hexValue = '#' + hex;

      // Convert to RGB
      this.rValue = parseInt(hex.substring(0, 2), 16);
      this.gValue = parseInt(hex.substring(2, 4), 16);
      this.bValue = parseInt(hex.substring(4, 6), 16);

      // Convert to HSL
      this.rgbToHsl(this.rValue, this.gValue, this.bValue);
    }
  }

  updateFromRgb() {
    // Clamp values
    this.rValue = Math.min(255, Math.max(0, this.rValue || 0));
    this.gValue = Math.min(255, Math.max(0, this.gValue || 0));
    this.bValue = Math.min(255, Math.max(0, this.bValue || 0));

    // Convert to Hex
    const toHex = (n: number) => {
      const hex = n.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    this.hexInput = toHex(this.rValue) + toHex(this.gValue) + toHex(this.bValue);
    this.hexValue = '#' + this.hexInput;

    // Convert to HSL
    this.rgbToHsl(this.rValue, this.gValue, this.bValue);
  }

  updateFromHsl() {
    // Clamp values
    this.hValue = Math.min(360, Math.max(0, this.hValue || 0));
    this.sValue = Math.min(100, Math.max(0, this.sValue || 0));
    this.lValue = Math.min(100, Math.max(0, this.lValue || 0));

    // Convert to RGB
    const s = this.sValue / 100;
    const l = this.lValue / 100;
    const k = (n: number) => (n + this.hValue / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    this.rValue = Math.round(255 * f(0));
    this.gValue = Math.round(255 * f(8));
    this.bValue = Math.round(255 * f(4));

    // Convert to Hex
    const toHex = (n: number) => {
      const hex = n.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    this.hexInput = toHex(this.rValue) + toHex(this.gValue) + toHex(this.bValue);
    this.hexValue = '#' + this.hexInput;
  }

  private rgbToHsl(r: number, g: number, b: number) {
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

    this.hValue = Math.round(h * 360);
    this.sValue = Math.round(s * 100);
    this.lValue = Math.round(l * 100);
  }
}
