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
      const generateModels = models.filter((m: any) =>
        m.supportedGenerationMethods?.includes('generateContent')
      );

      // Try to find the best model available (preferring Pro over Flash, and newer versions)
      // Sort by name to hopefully get latest versions first if naming convention holds
      generateModels.sort((a: any, b: any) => b.name.localeCompare(a.name));

      // Prioritize specific known high-quality models if present
      const bestModel =
        generateModels.find((m: any) => m.name.includes('gemini-1.5-pro')) ||
        generateModels.find((m: any) => m.name.includes('gemini-pro')) ||
        generateModels[0];

      if (bestModel) {
        // name is returned as "models/model-name", we need just "model-name"
        this.selectedModel = bestModel.name.replace('models/', '');
        console.log('Auto-selected AI Model:', this.selectedModel);
        return this.selectedModel!;
      }
    } catch (e) {
      console.warn('Failed to auto-detect model, using fallback');
    }

    return 'gemini-1.5-flash'; // Fallback
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
    } catch (error) {
      console.error('Gemini API Error:', error);
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
}
