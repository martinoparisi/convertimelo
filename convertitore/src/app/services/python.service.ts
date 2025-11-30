import { Injectable } from '@angular/core';

declare global {
  interface Window {
    loadPyodide: any;
  }
}

@Injectable({
  providedIn: 'root',
})
export class PythonService {
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

      console.log('Defining Python functions...');
      await this.pyodide.runPythonAsync(`
        import pint
        import json
        ureg = pint.UnitRegistry()
        
        def convert_unit(value, from_unit, to_unit):
            try:
                quantity = float(value) * ureg(from_unit)
                converted = quantity.to(to_unit)
                return json.dumps({"result": converted.magnitude, "unit": str(converted.units)})
            except Exception as e:
                return json.dumps({"error": str(e)})

        def manipulate_text(text, operation):
            try:
                if operation == 'uppercase':
                    res = text.upper()
                elif operation == 'lowercase':
                    res = text.lower()
                elif operation == 'reverse':
                    res = text[::-1]
                elif operation == 'word_count':
                    res = len(text.split())
                elif operation == 'char_count':
                    res = len(text)
                else:
                    res = text
                return json.dumps({"result": res})
            except Exception as e:
                return json.dumps({"error": str(e)})
      `);

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
