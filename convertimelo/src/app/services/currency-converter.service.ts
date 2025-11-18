import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";

interface ExchangeRates {
  [key: string]: number;
}

@Injectable({
  providedIn: "root",
})
export class CurrencyConverterService {
  private apiUrl = "https://api.exchangerate-api.com/v4/latest/";

  constructor(private http: HttpClient) {}

  getExchangeRates(baseCurrency: string): Observable<ExchangeRates> {
    return this.http
      .get<any>(`${this.apiUrl}${baseCurrency}`)
      .pipe(map((response) => response.rates));
  }

  convert(amount: number, from: string, to: string): Observable<number> {
    return this.getExchangeRates(from).pipe(
      map((rates) => {
        const rate = rates[to];
        if (!rate) {
          throw new Error(`Rate not found for ${to}`);
        }
        return amount * rate;
      })
    );
  }

  getSupportedCurrencies(): string[] {
    return [
      "USD",
      "EUR",
      "GBP",
      "JPY",
      "AUD",
      "CAD",
      "CHF",
      "CNY",
      "SEK",
      "NZD",
      "MXN",
      "SGD",
      "HKD",
      "NOK",
      "KRW",
      "TRY",
      "RUB",
      "INR",
      "BRL",
      "ZAR",
    ];
  }
}
