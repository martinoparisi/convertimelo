import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistoryService } from '../../services/history.service';

@Component({
  selector: 'app-file-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors duration-200">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Convertitore Immagini</h2>
      
      <div class="space-y-6">
        <!-- Upload Area -->
        <div class="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
             [class.border-indigo-500]="isDragging"
             (dragover)="onDragOver($event)"
             (dragleave)="onDragLeave($event)"
             (drop)="onDrop($event)">
          <div class="space-y-1 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div class="flex text-sm text-gray-600 dark:text-gray-400">
              <label for="file-upload" class="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                <span>Carica un file</span>
                <input id="file-upload" name="file-upload" type="file" class="sr-only" accept="image/*" (change)="onFileSelected($event)">
              </label>
              <p class="pl-1">o trascina e rilascia</p>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF fino a 10MB</p>
          </div>
        </div>

        <!-- Preview & Controls -->
        <div *ngIf="selectedFile" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Anteprima</h3>
            <div class="relative h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
              <img [src]="previewUrl" class="max-h-full max-w-full object-contain" alt="Preview">
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ selectedFile.name }} ({{ formatSize(selectedFile.size) }})</p>
          </div>

          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Opzioni di Conversione</h3>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Formato di Destinazione</label>
              <select [(ngModel)]="targetFormat" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WEBP</option>
              </select>
            </div>

            <div *ngIf="targetFormat === 'image/jpeg' || targetFormat === 'image/webp'">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Qualità ({{ quality * 100 }}%)</label>
              <input type="range" [(ngModel)]="quality" min="0.1" max="1" step="0.1" class="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer">
            </div>

            <button (click)="convert()" [disabled]="isConverting" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
              <span *ngIf="isConverting">Conversione in corso...</span>
              <span *ngIf="!isConverting">Converti e Scarica</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <canvas #canvas class="hidden"></canvas>
  `,
  styles: []
})
export class FileConverterComponent {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private historyService = inject(HistoryService);

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  targetFormat: string = 'image/jpeg';
  quality: number = 0.8;
  isDragging = false;
  isConverting = false;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files.length) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  convert() {
    if (!this.selectedFile || !this.previewUrl) return;

    this.isConverting = true;
    const img = new Image();
    img.onload = () => {
      const canvas = this.canvasRef.nativeElement;
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        this.isConverting = false;
        return;
      }

      // Draw image to canvas
      ctx.drawImage(img, 0, 0);

      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          this.downloadBlob(blob);
          this.historyService.addEntry('file', `Converted ${this.selectedFile?.name} to ${this.targetFormat}`);
        }
        this.isConverting = false;
      }, this.targetFormat, this.quality);
    };
    img.src = this.previewUrl;
  }

  downloadBlob(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // Determine extension
    let ext = 'jpg';
    if (this.targetFormat === 'image/png') ext = 'png';
    if (this.targetFormat === 'image/webp') ext = 'webp';

    const originalName = this.selectedFile?.name.split('.')[0] || 'converted';
    a.download = `${originalName}.${ext}`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
