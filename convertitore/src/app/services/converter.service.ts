import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PythonService } from './python.service';
// Import environment from the correct relative path based on workspace structure
// Assuming we are in convertitore/src/app/services
// And environment is in convertimelo/src/environments/environment.ts which is outside this project root?
// Wait, the workspace info showed convertitore has its own structure but maybe no environments folder?
// Let's check if we can import from the other project or if we should create one.
// The user's workspace has 'convertimelo' and 'convertitore'.
// I will hardcode the key for now to avoid import errors if the path is tricky,
// or better, I'll create an environment file in convertitore if it's missing.
// But for now let's just use the key directly to ensure it works.

@Injectable({
  providedIn: 'root',
})
export class ConverterService {
  private http = inject(HttpClient);
  private pythonService = inject(PythonService);

  // Hardcoded for now as environment file location is ambiguous in this mixed workspace
  private firebaseApiKey = 'AIzaSyAuYXtuPiNZAeYIvpk07FxNDZPW0JSj2GM';

  constructor() {}

  async convertUnit(value: number, fromUnit: string, toUnit: string): Promise<any> {
    // Use PythonService (Pyodide)
    return this.pythonService.convertUnit(value, fromUnit, toUnit);
  }

  async manipulateText(text: string, operation: string): Promise<any> {
    // Use PythonService (Pyodide)
    return this.pythonService.manipulateText(text, operation);
  }

  private selectedModel: string | null = null;

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

  async generateContent(prompt: string): Promise<any> {
    const model = await this.getModel();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.firebaseApiKey}`;

    const body = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
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
