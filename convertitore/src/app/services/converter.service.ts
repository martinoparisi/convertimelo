import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConverterService {
  private functions: Functions = inject(Functions);
  private http = inject(HttpClient);

  constructor() {}

  // Using HttpClient for direct HTTP calls if needed, or httpsCallable for SDK integration
  // Since we defined HTTP functions in Python, httpsCallable might expect 'on_call' format
  // but 'on_request' functions are standard HTTP.
  // For 'on_request' functions, we should use HttpClient.
  // URL format: https://REGION-PROJECT_ID.cloudfunctions.net/FUNCTION_NAME
  // Emulator: http://127.0.0.1:5001/convertimelo/us-central1/FUNCTION_NAME

  // Try emulator first, fallback to production cloud functions URL
  private emulatorBase = 'http://127.0.0.1:5001/convertimelo/us-central1';
  private cloudBase = 'https://us-central1-convertimelo.cloudfunctions.net';

  private async postWithFallback(path: string, body: any): Promise<any> {
    // Attempt emulator first
    try {
      const emuUrl = `${this.emulatorBase}/${path}`;
      return await firstValueFrom(this.http.post(emuUrl, body));
    } catch (emuErr) {
      // If emulator not available, fallback to cloud functions URL
      const cloudUrl = `${this.cloudBase}/${path}`;
      return firstValueFrom(this.http.post(cloudUrl, body));
    }
  }

  async convertUnit(value: number, fromUnit: string, toUnit: string): Promise<any> {
    return this.postWithFallback('unit_converter', {
      value,
      from_unit: fromUnit,
      to_unit: toUnit,
    });
  }

  async manipulateText(text: string, operation: string): Promise<any> {
    return this.postWithFallback('text_manipulator', {
      text,
      operation,
    });
  }

  async generateContent(prompt: string): Promise<any> {
    return this.postWithFallback('genkit_generate', {
      prompt,
    });
  }

  async convertFile(payload: any): Promise<any> {
    return this.postWithFallback('file_converter', payload);
  }

  async getExchangeRates(base: string): Promise<any> {
    return firstValueFrom(this.http.get(`https://api.exchangerate-api.com/v4/latest/${base}`));
  }
}
