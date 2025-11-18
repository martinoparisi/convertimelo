import { Component, OnInit } from '@angular/core';
import { CurrencyConverterService } from '../../services/currency-converter.service';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.css']
})
export class CurrencyConverterComponent implements OnInit {
  amount: number = 1;
  fromCurrency: string = 'USD';
  toCurrency: string = 'EUR';
  result: number = 0;
  loading: boolean = false;
  error: string = '';
  currencies: string[] = [];

  constructor(private currencyService: CurrencyConverterService) {}

  ngOnInit() {
    this.currencies = this.currencyService.getSupportedCurrencies();
  }

  convertCurrency() {
    if (this.amount <= 0) {
      this.error = 'Inserisci un importo valido';
      return;
    }

    this.loading = true;
    this.error = '';
    this.result = 0;

    this.currencyService.convert(this.amount, this.fromCurrency, this.toCurrency)
      .subscribe({
        next: (result) => {
          this.result = result;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Errore durante la conversione: ' + err.message;
          this.loading = false;
        }
      });
  }

  swapCurrencies() {
    const temp = this.fromCurrency;
    this.fromCurrency = this.toCurrency;
    this.toCurrency = temp;
    if (this.result > 0) {
      this.convertCurrency();
    }
  }
}
