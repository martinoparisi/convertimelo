import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ConverterService {
    private functions: Functions = inject(Functions);
    private http = inject(HttpClient);

    constructor() { }

    // Using HttpClient for direct HTTP calls if needed, or httpsCallable for SDK integration
    // Since we defined HTTP functions in Python, httpsCallable might expect 'on_call' format 
    // but 'on_request' functions are standard HTTP.
    // For 'on_request' functions, we should use HttpClient.
    // URL format: https://REGION-PROJECT_ID.cloudfunctions.net/FUNCTION_NAME
    // Emulator: http://127.0.0.1:5001/convertimelo/us-central1/FUNCTION_NAME

    // TODO: Make this configurable
    private baseUrl = 'http://127.0.0.1:5001/convertimelo/us-central1';

    async convertUnit(value: number, fromUnit: string, toUnit: string): Promise<any> {
        // Using HttpClient because the Python function is an HTTP function (on_request)
        return firstValueFrom(this.http.post(`${this.baseUrl}/unit_converter`, {
            value,
            from_unit: fromUnit,
            to_unit: toUnit
        }));
    }

    async manipulateText(text: string, operation: string): Promise<any> {
        return firstValueFrom(this.http.post(`${this.baseUrl}/text_manipulator`, {
            text,
            operation
        }));
    }

    async generateContent(prompt: string): Promise<any> {
        return firstValueFrom(this.http.post(`${this.baseUrl}/genkit_generate`, {
            prompt
        }));
    }

    async getExchangeRates(base: string): Promise<any> {
        return firstValueFrom(this.http.get(`https://api.exchangerate-api.com/v4/latest/${base}`));
    }
}
