import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistoryService } from '../../services/history.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-file-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-slate-800/50 backdrop-blur-sm shadow-lg border border-indigo-500/20 rounded-lg p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(79,70,229,0.15)]">
      <h2 class="text-2xl font-bold text-white mb-6 drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]">Convertitore Immagini</h2>
      
      <div class="space-y-6">
        <!-- Upload Area -->
        <div class="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-all duration-300 group"
             [class.border-indigo-500]="isDragging"
             [class.bg-indigo-500/10]="isDragging"
             [class.border-gray-600]="!isDragging"
             [class.hover:border-indigo-400]="!isDragging"
             [class.hover:bg-slate-800]="!isDragging"
             (dragover)="onDragOver($event)"
             (dragleave)="onDragLeave($event)"
             (drop)="onDrop($event)">
          <div class="space-y-1 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div class="flex text-sm text-gray-400">
              <label for="file-upload" class="relative cursor-pointer rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 hover:underline">
                <span>Carica un file</span>
                <input id="file-upload" name="file-upload" type="file" class="sr-only" accept="image/*" (change)="onFileSelected($event)">
              </label>
              <p class="pl-1">o trascina e rilascia</p>
            </div>
            <p class="text-xs text-gray-500">PNG, JPG, GIF fino a 10MB</p>
          </div>
        </div>

        <!-- Preview & Controls -->
        <div *ngIf="selectedFile" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <h3 class="text-lg font-medium text-white">Anteprima</h3>
            <div class="relative h-64 bg-slate-900/50 rounded-lg overflow-hidden flex items-center justify-center border border-gray-700">
              <img [src]="previewUrl" class="max-h-full max-w-full object-contain" alt="Preview">
            </div>
            <p class="text-sm text-gray-400">{{ selectedFile.name }} ({{ formatSize(selectedFile.size) }})</p>
          </div>

          <div class="space-y-4">
            <h3 class="text-lg font-medium text-white">Opzioni di Conversione</h3>
            
            <div>
              <label class="block text-sm font-medium text-gray-300">Formato di Destinazione</label>
              <select [(ngModel)]="targetFormat" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-slate-800 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm">
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WEBP</option>
              </select>
            </div>

            <div *ngIf="targetFormat === 'image/jpeg' || targetFormat === 'image/webp'">
              <label class="block text-sm font-medium text-gray-300">Qualità ({{ quality * 100 }}%)</label>
              <input type="range" [(ngModel)]="quality" min="0.1" max="1" step="0.1" class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500">
            </div>

            <button (click)="convert()" [disabled]="isConverting" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-[0_0_10px_rgba(79,70,229,0.3)] text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
              <span *ngIf="isConverting">Conversione in corso...</span>
              <span *ngIf="!isConverting">Converti e Scarica</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class FileConverterComponent {
  private historyService = inject(HistoryService);
  private http = inject(HttpClient);

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

    // Convert base64 to raw string (remove header)
    // Actually the backend handles the header removal or we can send it as is.
    // Let's send the full data URL.

    const payload = {
      file: this.previewUrl,
      format: this.targetFormat.split('/')[1].toUpperCase(), // image/jpeg -> JPEG
      quality: this.quality * 100
    };

    this.http.post<{ file: string }>('http://127.0.0.1:5001/convertimelo/us-central1/file_converter', payload)
      .subscribe({
        next: (response) => {
          this.downloadBase64(response.file);
          this.historyService.addEntry('file', `Converted ${this.selectedFile?.name} to ${this.targetFormat}`);
          this.isConverting = false;
        },
        error: (err) => {
          console.error('Conversion failed', err);
          alert('Conversion failed: ' + err.message);
          this.isConverting = false;
        }
      });
  }

  downloadBase64(dataUrl: string) {
    const a = document.createElement('a');
    a.href = dataUrl;

    // Determine extension
    let ext = 'jpg';
    if (this.targetFormat === 'image/png') ext = 'png';
    if (this.targetFormat === 'image/webp') ext = 'webp';

    const originalName = this.selectedFile?.name.split('.')[0] || 'converted';
    a.download = `${originalName}.${ext}`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
