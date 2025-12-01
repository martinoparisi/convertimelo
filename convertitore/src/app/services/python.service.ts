import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

declare global {
  interface Window {
    loadPyodide: any;
  }
}

@Injectable({
  providedIn: 'root',
})
export class PythonService {
  private http = inject(HttpClient);
  private pyodide: any;
  private isReady = false;
  private initPromise: Promise<void> | null = null;

  constructor() {}

  async init() {
    if (this.isReady) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      console.log('Initializing Pyodide...');
      this.pyodide = await window.loadPyodide();

      console.log('Loading micropip...');
      await this.pyodide.loadPackage('micropip');
      const micropip = this.pyodide.pyimport('micropip');

      console.log('Installing pint...');
      await micropip.install('pint');

      console.log('Loading Python scripts...');
      const pythonCode = await firstValueFrom(
        this.http.get('assets/python/scripts.py', { responseType: 'text' })
      );

      console.log('Defining Python functions...');
      await this.pyodide.runPythonAsync(pythonCode);

      this.isReady = true;
      console.log('Pyodide ready!');
    })();

    return this.initPromise;
  }

  async convertUnit(value: number, fromUnit: string, toUnit: string): Promise<any> {
    await this.init();
    const code = `convert_unit(${value}, '${fromUnit}', '${toUnit}')`;
    const resultJson = await this.pyodide.runPythonAsync(code);
    return JSON.parse(resultJson);
  }

  async manipulateText(text: string, operation: string): Promise<any> {
    await this.init();
    // Escape text to avoid syntax errors in python string
    const safeText = text.replace(/'/g, "\\'").replace(/\n/g, '\\n');
    const code = `manipulate_text('${safeText}', '${operation}')`;
    const resultJson = await this.pyodide.runPythonAsync(code);
    return JSON.parse(resultJson);
  }
}
