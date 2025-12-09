import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PythonService } from './python.service';

/**
 * Service for handling various conversion and AI generation tasks.
 * Integrates with PythonService for local processing and Google Gemini API for AI tasks.
 */
@Injectable({
  providedIn: 'root',
})
export class ConverterService {
  private http = inject(HttpClient);
  private pythonService = inject(PythonService);

  // API Key for Google Gemini (Hardcoded for demo purposes)
  private firebaseApiKey = 'AIzaSyAuYXtuPiNZAeYIvpk07FxNDZPW0JSj2GM';

  constructor() {}

  /**
   * Converts a value from one unit to another using PythonService.
   * @param value The numerical value to convert.
   * @param fromUnit The unit to convert from.
   * @param toUnit The unit to convert to.
   * @returns A Promise resolving to the converted value.
   */
  async convertUnit(value: number, fromUnit: string, toUnit: string): Promise<any> {
    // Use PythonService (Pyodide)
    return this.pythonService.convertUnit(value, fromUnit, toUnit);
  }

  /**
   * Manipulates text using PythonService.
   * @param text The input text.
   * @param operation The operation to perform (e.g., 'uppercase', 'reverse').
   * @returns A Promise resolving to the manipulated text or result.
   */
  async manipulateText(text: string, operation: string): Promise<any> {
    // Use PythonService (Pyodide)
    return this.pythonService.manipulateText(text, operation);
  }

  private selectedModel: string | null = null;

  /**
   * Retrieves the best available Gemini model from the API.
   * Caches the result to avoid repeated calls.
   * @returns A Promise resolving to the model name.
   */
  private async getModel(): Promise<string> {
    if (this.selectedModel) return this.selectedModel;

    try {
      const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${this.firebaseApiKey}`;
      const response: any = await firstValueFrom(this.http.get(listUrl));

      const models = response.models || [];
      // Filter for models that support content generation
      // Escludiamo esplicitamente modelli TTS (Text-to-Speech) o Audio che non generano testo
      const generateModels = models.filter(
        (m: any) =>
          m.supportedGenerationMethods?.includes('generateContent') &&
          !m.name.toLowerCase().includes('tts') &&
          !m.name.toLowerCase().includes('audio')
      );

      // Ordina dinamicamente per trovare il modello più recente disponibile
      generateModels.sort((a: any, b: any) => {
        // Funzione helper per estrarre la versione (es. 1.5 da gemini-1.5-pro)
        const getVersion = (name: string) => {
          const match = name.match(/gemini-(\d+(\.\d+)?)/);
          return match ? parseFloat(match[1]) : 0;
        };

        const vA = getVersion(a.name);
        const vB = getVersion(b.name);

        // 1. Preferisci SEMPRE "flash" perché ha quote molto più alte (evita errori 429)
        // Anche se è una versione precedente (es. 1.5-flash vs 3.0-pro), per un'app pubblica la stabilità è prioritaria.
        const isFlashA = a.name.toLowerCase().includes('flash');
        const isFlashB = b.name.toLowerCase().includes('flash');

        if (isFlashA && !isFlashB) return -1; // A (Flash) viene prima
        if (!isFlashA && isFlashB) return 1; // B (Flash) viene prima

        // 2. Ordina per versione decrescente (es. 1.5 > 1.0)
        if (vB !== vA) return vB - vA;

        // 3. Altrimenti ordine alfabetico inverso (per prendere eventuali versioni "latest" o "pro" se flash non c'è)
        return b.name.localeCompare(a.name);
      });

      if (generateModels.length > 0) {
        // Seleziona il primo modello della lista ordinata
        const bestModel = generateModels[0];
        this.selectedModel = bestModel.name.replace('models/', '');
        console.log('Auto-selected AI Model:', this.selectedModel);
        return this.selectedModel!;
      }
    } catch (e) {
      console.warn('Failed to auto-detect model, using fallback');
    }

    return 'gemini-1.5-flash'; // Fallback solo se la chiamata alla lista fallisce
  }

  /**
   * Generates content using Google Gemini API.
   * @param prompt The text prompt for the AI.
   * @param imageBase64 Optional base64 encoded image for multimodal requests.
   * @returns A Promise resolving to the generated text content.
   */
  async generateContent(prompt: string, imageBase64?: string): Promise<any> {
    const model = await this.getModel();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.firebaseApiKey}`;

    const parts: any[] = [{ text: prompt }];

    if (imageBase64) {
      parts.push({
        inline_data: {
          mime_type: 'image/jpeg', // Assuming JPEG for simplicity, or we can pass mime type
          data: imageBase64,
        },
      });
    }

    const body = {
      contents: [
        {
          parts: parts,
        },
      ],
    };

    try {
      const response: any = await firstValueFrom(this.http.post(url, body));
      if (response.candidates && response.candidates.length > 0) {
        return { text: response.candidates[0].content.parts[0].text };
      }
      return { text: 'No response generated.' };
    } catch (error: any) {
      console.error('Gemini API Error:', error);

      // Gestione automatica del retry per errori 429
      const errorMessage = error.error?.error?.message || '';
      const isQuotaError =
        error.status === 429 ||
        errorMessage.includes('Quota exceeded') ||
        errorMessage.includes('429');

      if (isQuotaError && errorMessage.includes('Please retry in')) {
        const match = errorMessage.match(/Please retry in ([0-9.]+)s/);
        if (match) {
          const seconds = Math.ceil(parseFloat(match[1])) + 1; // +1s buffer
          console.log(`Quota exceeded. Retrying in ${seconds} seconds...`);

          // Lancia un errore speciale che il componente può intercettare per mostrare il countdown
          throw {
            isRetryable: true,
            retryInSeconds: seconds,
            originalError: error,
            retryFunction: () => this.generateContent(prompt, imageBase64),
          };
        }
      }

      throw error;
    }
  }

  async convertFile(payload: any): Promise<any> {
    // Use the same hostname as the frontend to allow access from other devices (e.g. mobile)
    // This assumes the Python server is running on the same machine as the Angular app
    const hostname = window.location.hostname;
    const backendUrl = `http://${hostname}:5000/file_converter`;
    return firstValueFrom(this.http.post(backendUrl, payload));
  }

  async getExchangeRates(base: string): Promise<any> {
    return firstValueFrom(this.http.get(`https://api.exchangerate-api.com/v4/latest/${base}`));
  }

  /**
   * Extracts a user-friendly error message from the API error response.
   * Specifically handles rate limit errors.
   * @param err The error object.
   * @returns A friendly error message if applicable, otherwise null.
   */
  getFriendlyErrorMessage(err: any): string | null {
    // Gestione specifica per errore 429 (Too Many Requests) o errori di quota
    const errorMessage = err.error?.error?.message || '';
    const isQuotaError =
      err.status === 429 || errorMessage.includes('Quota exceeded') || errorMessage.includes('429');

    if (isQuotaError) {
      if (errorMessage.includes('Please retry in')) {
        const match = errorMessage.match(/Please retry in ([0-9.]+)s/);
        // Aggiungiamo 2 secondi di buffer per sicurezza
        const seconds = match ? Math.ceil(parseFloat(match[1])) + 2 : 'qualche';
        return `Limite richieste raggiunto. Riprova tra ${seconds} secondi.`;
      }
      return 'Limite richieste raggiunto. Riprova tra qualche secondo.';
    }

    return null;
  }
}
