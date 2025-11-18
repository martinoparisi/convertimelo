import { Injectable } from '@angular/core';

interface ConversionFactor {
  [key: string]: number;
}

interface UnitCategory {
  name: string;
  units: string[];
  baseUnit: string;
  factors: ConversionFactor;
}

@Injectable({
  providedIn: 'root'
})
export class UnitConverterService {
  private categories: UnitCategory[] = [
    {
      name: 'Lunghezza',
      baseUnit: 'metri',
      units: ['metri', 'chilometri', 'miglia', 'piedi', 'pollici', 'centimetri'],
      factors: {
        'metri': 1,
        'chilometri': 0.001,
        'miglia': 0.000621371,
        'piedi': 3.28084,
        'pollici': 39.3701,
        'centimetri': 100
      }
    },
    {
      name: 'Peso',
      baseUnit: 'chilogrammi',
      units: ['chilogrammi', 'grammi', 'libbre', 'once', 'tonnellate'],
      factors: {
        'chilogrammi': 1,
        'grammi': 1000,
        'libbre': 2.20462,
        'once': 35.274,
        'tonnellate': 0.001
      }
    },
    {
      name: 'Temperatura',
      baseUnit: 'celsius',
      units: ['celsius', 'fahrenheit', 'kelvin'],
      factors: {
        'celsius': 1,
        'fahrenheit': 1,
        'kelvin': 1
      }
    },
    {
      name: 'Volume',
      baseUnit: 'litri',
      units: ['litri', 'millilitri', 'galloni', 'once fluide', 'metri cubi'],
      factors: {
        'litri': 1,
        'millilitri': 1000,
        'galloni': 0.264172,
        'once fluide': 33.814,
        'metri cubi': 0.001
      }
    }
  ];

  constructor() {}

  getCategories(): UnitCategory[] {
    return this.categories;
  }

  getCategoryByName(name: string): UnitCategory | undefined {
    return this.categories.find(cat => cat.name === name);
  }

  convert(value: number, fromUnit: string, toUnit: string, category: string): number {
    const cat = this.getCategoryByName(category);
    if (!cat) {
      throw new Error('Category not found');
    }

    // Special handling for temperature
    if (category === 'Temperatura') {
      return this.convertTemperature(value, fromUnit, toUnit);
    }

    // For other units, convert to base unit first, then to target unit
    const fromFactor = cat.factors[fromUnit];
    const toFactor = cat.factors[toUnit];

    if (!fromFactor || !toFactor) {
      throw new Error('Unit not found');
    }

    const baseValue = value / fromFactor;
    return baseValue * toFactor;
  }

  private convertTemperature(value: number, from: string, to: string): number {
    // Convert to Celsius first
    let celsius: number;
    
    switch(from) {
      case 'celsius':
        celsius = value;
        break;
      case 'fahrenheit':
        celsius = (value - 32) * 5/9;
        break;
      case 'kelvin':
        celsius = value - 273.15;
        break;
      default:
        throw new Error('Unknown temperature unit');
    }

    // Convert from Celsius to target
    switch(to) {
      case 'celsius':
        return celsius;
      case 'fahrenheit':
        return celsius * 9/5 + 32;
      case 'kelvin':
        return celsius + 273.15;
      default:
        throw new Error('Unknown temperature unit');
    }
  }
}
