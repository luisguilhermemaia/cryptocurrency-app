import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataProvider {

  baseUrl: string = `https://min-api.cryptocompare.com/data`;

  constructor(private _http: HttpClient) {}

  get(endpoint) {
    return this._http.get(`${this.baseUrl}/${endpoint}`);
  }

  getCoins(coins) {
    const endpoint = `pricemulti?fsyms=${coins.join()}&tsyms=USD,BRL`;
    return this.get(endpoint)
               .map(coins => this.extractCoins(coins));
  }

  private extractCoins(coins) {
    let coinArray = []
    Object.keys(coins).map(name => {
        if(coins.hasOwnProperty(name)) {
            let values = this.extractValues(coins[name]);
            let coin = new Currency(name, values);
            coinArray.push(coin);
        }
    });
    return coinArray;
  }

  extractValues(rates) {
    let currencies:CurrencyValue[] = [];
    Object.keys(rates).map(currency => {
        if(rates.hasOwnProperty(currency)) {
            let value = new CurrencyValue(currency,rates[currency]);
            currencies.push(value);
        }
    });
    
    return currencies;
  }

  getCoin(coin: string) {
    const endpoint = `pricemultifull?fsyms=${coin}&tsyms=USD`;
    return this.get(endpoint);
  }

  getChart(coin: string) {
    return this.get(`histoday?fsym=${coin}&tsym=USD&limit=30&aggregate=1`);
  }

  allCoins() {
    return this._http.get("../assets/mock/coins.json");
  }

}

export class Currency {
  constructor(private name: string, private value: CurrencyValue[]) {}
}

export class CurrencyValue {
  constructor(private name: string, private value: string) {}
}