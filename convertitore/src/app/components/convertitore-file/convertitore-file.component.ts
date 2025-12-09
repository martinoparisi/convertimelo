import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistoryService } from '../../services/history.service';
import { HttpClient } from '@angular/common/http';
import { ConverterService } from '../../services/converter.service';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { jsPDF } from 'jspdf';

/**
 * Componente per la conversione di file.
 * Supporta la conversione di immagini (PNG, JPG, WEBP), creazione di PDF e conversione audio usando FFmpeg (WASM).
 */
@Component({
  selector: 'app-convertitore-file',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2 class="card-title">Convertitore File</h2>

      <div class="space-y-6">
        <!-- Area di Caricamento -->
        <div
          class="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-all duration-300 group"
          [ngClass]="{
            'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10': staTrascinando,
            'border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-slate-800':
              !staTrascinando
          }"
          (dragover)="alTrascinamentoSopra($event)"
          (dragleave)="alUscitaTrascinamento($event)"
          (drop)="alRilascio($event)"
        >
          <div class="space-y-1 text-center">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div class="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
              <label
                for="file-upload"
                class="relative cursor-pointer rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 hover:underline"
              >
                <span>Carica un file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  class="sr-only"
                  (change)="alFileSelezionato($event)"
                  accept=".png,.jpeg,.jpg,.webp,.gif,.mp3,.mp4,.wav,.pdf,.txt"
                />
              </label>
              <p class="pl-1">o trascina e rilascia</p>
            </div>
            <p class="text-xs text-gray-500">PNG, JPEG, WEBP, GIF, MP3, MP4, WAV, PDF, TXT</p>
          </div>
        </div>

        <!-- Anteprima & Controlli -->
        <div *ngIf="fileSelezionato" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Anteprima</h3>
            <div
              class="relative h-64 bg-gray-100 dark:bg-slate-900/50 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 dark:border-gray-700"
            >
              <img
                *ngIf="eImmagine(fileSelezionato)"
                [src]="urlAnteprima"
                class="max-h-full max-w-full object-contain"
                alt="Anteprima"
              />
              <div *ngIf="!eImmagine(fileSelezionato)" class="text-center">
                <svg
                  class="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.414.586l5.414 5.414a1 1 0 01.586 1.414V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {{ fileSelezionato.name }}
                </p>
              </div>
            </div>

            <!-- Pulsante Descrizione AI -->
            <button
              *ngIf="eImmagine(fileSelezionato)"
              (click)="generaDescrizione()"
              [disabled]="staGenerandoDescrizione"
              class="w-full mt-2 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all shadow-[0_0_10px_rgba(147,51,234,0.3)] hover:shadow-[0_0_15px_rgba(147,51,234,0.5)]"
            >
              <span *ngIf="staGenerandoDescrizione" class="animate-pulse">Generazione...</span>
              <span *ngIf="!staGenerandoDescrizione">✨ Genera descrizione AI</span>
            </button>

            <!-- Risultato AI -->
            <div
              *ngIf="descrizioneAI"
              class="mt-2 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-md border border-gray-200 dark:border-indigo-500/30 text-sm text-gray-700 dark:text-gray-300"
            >
              <h4 class="font-medium mb-1 text-indigo-600 dark:text-indigo-400">Descrizione AI:</h4>
              {{ descrizioneAI }}
            </div>

            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ fileSelezionato.name }} ({{ formattaDimensione(fileSelezionato.size) }})
            </p>
          </div>

          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Opzioni di Conversione
            </h3>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Formato di Destinazione</label
              >
              <select
                [(ngModel)]="formatoDestinazione"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
              >
                <optgroup
                  label="Immagini"
                  *ngIf="eImmagine(fileSelezionato) || eSconosciuto(fileSelezionato)"
                >
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WEBP</option>
                </optgroup>
                <optgroup
                  label="Documenti"
                  *ngIf="eDocumento(fileSelezionato) || eSconosciuto(fileSelezionato)"
                >
                  <option value="application/pdf">PDF</option>
                  <option value="text/plain">TXT</option>
                </optgroup>
                <optgroup
                  label="Video"
                  *ngIf="eVideo(fileSelezionato) || eSconosciuto(fileSelezionato)"
                >
                  <option value="audio/mp3">MP3 (Audio)</option>
                  <option value="video/gif">GIF</option>
                </optgroup>
              </select>
            </div>

            <div
              *ngIf="
                (eImmagine(fileSelezionato) || eSconosciuto(fileSelezionato)) &&
                (formatoDestinazione === 'image/jpeg' ||
                  formatoDestinazione === 'image/webp' ||
                  formatoDestinazione === 'application/pdf')
              "
            >
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Qualità ({{ qualita * 100 }}%)</label
              >
              <input
                type="range"
                [(ngModel)]="qualita"
                min="0.1"
                max="1"
                step="0.1"
                class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <button
              (click)="converti()"
              [disabled]="staConvertendo"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-[0_0_10px_rgba(79,70,229,0.3)] text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span *ngIf="staConvertendo">Conversione in corso...</span>
              <span *ngIf="!staConvertendo">Converti e Scarica</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ConvertitoreFileComponent implements OnInit {
  private historyService = inject(HistoryService);
  private http = inject(HttpClient);
  private converterService = inject(ConverterService);

  fileSelezionato: File | null = null;
  urlAnteprima: string | null = null;
  formatoDestinazione: string = 'image/jpeg';
  qualita: number = 0.8;
  staTrascinando = false;
  staConvertendo = false;
  ffmpeg: FFmpeg | null = null;
  ffmpegCaricato = false;

  descrizioneAI: string | null = null;
  staGenerandoDescrizione = false;

  async ngOnInit() {
    // Carica FFmpeg all'avvio
    this.caricaFFmpeg();
  }

  async generaDescrizione() {
    if (!this.fileSelezionato || !this.eImmagine(this.fileSelezionato)) return;

    this.staGenerandoDescrizione = true;
    this.descrizioneAI = null;

    try {
      const base64 = await this.fileToBase64(this.fileSelezionato);
      // Rimuovi prefisso data URL (es. "data:image/png;base64,")
      const base64Data = base64.split(',')[1];

      const prompt =
        "Descrivi questa immagine in modo sintetico e breve in italiano. Rispondi SOLO con la descrizione, senza preamboli come 'Ecco la descrizione' o 'Certamente'.";
      const response = await this.converterService.generateContent(prompt, base64Data);
      this.descrizioneAI = response.text;
      this.historyService.addEntry('file', 'Descrizione Immagine', this.descrizioneAI || '');
    } catch (error) {
      console.error('Errore durante la generazione della descrizione:', error);
      this.descrizioneAI = 'Errore durante la generazione della descrizione.';
    } finally {
      this.staGenerandoDescrizione = false;
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  async caricaFFmpeg() {
    if (this.ffmpegCaricato) return;

    this.ffmpeg = new FFmpeg();

    // Log progress
    this.ffmpeg.on('log', ({ message }: { message: string }) => {
      console.log('FFmpeg Log:', message);
    });

    try {
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
      await this.ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      this.ffmpegCaricato = true;
      console.log('FFmpeg caricato con successo');
    } catch (e) {
      console.error('Fallito caricamento FFmpeg:', e);
      // Fallback o notifica utente se necessario
    }
  }

  alTrascinamentoSopra(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.staTrascinando = true;
  }

  alUscitaTrascinamento(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.staTrascinando = false;
  }

  alRilascio(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.staTrascinando = false;

    if (event.dataTransfer?.files.length) {
      this.gestisciFile(event.dataTransfer.files[0]);
    }
  }

  alFileSelezionato(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.gestisciFile(input.files[0]);
    }
  }

  gestisciFile(file: File) {
    const tipiConsentiti = [
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/gif',
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/x-wav',
      'video/mp4',
      'application/pdf',
      'text/plain',
    ];

    // Controllo estensione (controllo lasco se mime type mancante o generico)
    const est = file.name.split('.').pop()?.toLowerCase();
    const estConsentita = [
      'png',
      'jpg',
      'jpeg',
      'webp',
      'gif',
      'mp3',
      'wav',
      'mp4',
      'pdf',
      'txt',
    ].includes(est || '');

    if (!tipiConsentiti.some((t) => file.type.includes(t)) && !estConsentita) {
      alert(
        'Tipo di file non supportato. Seleziona PNG, JPEG, WEBP, GIF, MP3, MP4, WAV, PDF, o TXT.'
      );
      this.fileSelezionato = null;
      return;
    }

    this.fileSelezionato = file;

    // Imposta formato destinazione default
    if (this.eImmagine(file)) {
      this.formatoDestinazione = 'image/jpeg';
      const reader = new FileReader();
      reader.onload = (e) => {
        this.urlAnteprima = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else if (this.eDocumento(file)) {
      this.formatoDestinazione = 'application/pdf';
      this.urlAnteprima = null;
    } else if (this.eVideo(file)) {
      this.formatoDestinazione = 'audio/mp3'; // Default video to audio
      this.urlAnteprima = null;
    } else if (this.eAudio(file)) {
      this.formatoDestinazione = 'audio/mp3';
      this.urlAnteprima = null;
    } else {
      this.formatoDestinazione = 'image/jpeg';
      this.urlAnteprima = null;
    }
  }

  eImmagine(file: File): boolean {
    return (
      file && (file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name))
    );
  }

  eDocumento(file: File): boolean {
    return (
      file &&
      (file.type.includes('pdf') || file.type.includes('text') || /\.(pdf|txt)$/i.test(file.name))
    );
  }

  eVideo(file: File): boolean {
    return file && (file.type.startsWith('video/') || /\.(mp4)$/i.test(file.name));
  }

  eAudio(file: File): boolean {
    return file && (file.type.startsWith('audio/') || /\.(mp3|wav)$/i.test(file.name));
  }

  eSconosciuto(file: File): boolean {
    return (
      !this.eImmagine(file) && !this.eDocumento(file) && !this.eVideo(file) && !this.eAudio(file)
    );
  }

  formattaDimensione(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async converti() {
    if (!this.fileSelezionato) return;

    this.staConvertendo = true;

    try {
      // Logica conversione client-side
      if (this.formatoDestinazione === 'application/pdf') {
        await this.convertiInPdf(this.fileSelezionato);
      } else if (
        this.eImmagine(this.fileSelezionato) &&
        this.formatoDestinazione.startsWith('image/')
      ) {
        // Usa Canvas per conversione semplice immagine-immagine (eccetto GIF forse)
        if (this.formatoDestinazione.includes('gif') || this.fileSelezionato.type.includes('gif')) {
          // Usa FFmpeg per GIF
          await this.convertiConFFmpeg(this.fileSelezionato);
        } else {
          await this.convertiImmagineConCanvas(this.fileSelezionato);
        }
      } else {
        // Usa FFmpeg per Audio/Video
        await this.convertiConFFmpeg(this.fileSelezionato);
      }

      this.historyService.addEntry(
        'file',
        this.fileSelezionato?.name || 'File sconosciuto',
        `Convertito in ${this.formatoDestinazione}`
      );
    } catch (error: any) {
      console.error('Conversione fallita', error);
      alert('Conversione fallita: ' + (error.message || error));
    } finally {
      this.staConvertendo = false;
    }
  }

  async convertiInPdf(file: File) {
    if (this.eImmagine(file)) {
      const imgData = await this.comprimiImmagine(file, Number(this.qualita));
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${file.name.split('.')[0]}.pdf`);
    } else if (file.type.includes('text') || file.name.endsWith('.txt')) {
      const text = await file.text();
      const pdf = new jsPDF();
      pdf.setFontSize(12);
      const splitText = pdf.splitTextToSize(text, 180);
      pdf.text(splitText, 10, 10);
      pdf.save(`${file.name.split('.')[0]}.pdf`);
    } else {
      throw new Error('Conversione PDF supportata solo per Immagini e file di Testo.');
    }
  }

  private comprimiImmagine(file: File, qualita: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Contesto Canvas non disponibile'));
          return;
        }
        // Sfondo bianco per gestione trasparenza (JPEG)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const dataUrl = canvas.toDataURL('image/jpeg', qualita);
        resolve(dataUrl);
      };
      img.onerror = (e) => reject(e);
      img.src = URL.createObjectURL(file);
    });
  }

  async convertiImmagineConCanvas(file: File) {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Contesto Canvas non disponibile'));
          return;
        }

        // Gestione trasparenza per JPEG
        if (this.formatoDestinazione.includes('jpeg') || this.formatoDestinazione.includes('jpg')) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        let mime = this.formatoDestinazione;
        if (mime === 'image/jpg') mime = 'image/jpeg';

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              this.scaricaUrl(url, this.ottieniEstensione(mime));
              resolve();
            } else {
              reject(new Error('Canvas toBlob fallito'));
            }
          },
          mime,
          Number(this.qualita)
        );
      };
      img.onerror = (e) => reject(e);
      img.src = URL.createObjectURL(file);
    });
  }

  async convertiConFFmpeg(file: File) {
    if (!this.ffmpegCaricato || !this.ffmpeg) {
      // Prova a caricare di nuovo
      await this.caricaFFmpeg();
      if (!this.ffmpegCaricato || !this.ffmpeg) {
        throw new Error('FFmpeg non caricato. Controlla la tua connessione internet.');
      }
    }

    const ffmpeg = this.ffmpeg;
    const inputName = 'input' + this.ottieniEstensioneFile(file.name);
    const outputExt = this.ottieniEstensione(this.formatoDestinazione);
    const outputName = 'output.' + outputExt;

    await ffmpeg.writeFile(inputName, await fetchFile(file));

    // Costruisci comando
    let args = ['-i', inputName];

    // Qualità/Impostazioni
    if (outputExt === 'mp3') {
      args.push('-b:a', '192k');
    } else if (outputExt === 'jpg' || outputExt === 'jpeg') {
      // args.push('-q:v', '2'); // ffmpeg quality scale
    }

    args.push(outputName);

    await ffmpeg.exec(args);

    const data = await ffmpeg.readFile(outputName);
    const blob = new Blob([data as any], { type: this.formatoDestinazione });
    const url = URL.createObjectURL(blob);
    this.scaricaUrl(url, outputExt);
  }

  leggiFileComeDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }

  ottieniEstensioneFile(filename: string): string {
    return '.' + filename.split('.').pop();
  }

  ottieniEstensione(mime: string): string {
    if (mime.includes('jpeg') || mime.includes('jpg')) return 'jpg';
    if (mime.includes('png')) return 'png';
    if (mime.includes('webp')) return 'webp';
    if (mime.includes('gif')) return 'gif';
    if (mime.includes('pdf')) return 'pdf';
    if (mime.includes('plain')) return 'txt';
    if (mime.includes('mp3')) return 'mp3';
    if (mime.includes('wav')) return 'wav';
    if (mime.includes('mp4')) return 'mp4';
    return 'bin';
  }

  scaricaUrl(url: string, est: string) {
    const a = document.createElement('a');
    a.href = url;
    const nomeOriginale = this.fileSelezionato?.name.split('.')[0] || 'convertito';
    a.download = `${nomeOriginale}.${est}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
