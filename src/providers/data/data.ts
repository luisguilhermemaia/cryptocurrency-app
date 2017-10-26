import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import "rxjs/add/operator/map";

@Injectable()
export class DataProvider {
  result: any;
  baseUrl = 'https://min-api.cryptocompare.com/data';

  constructor(public _http: HttpClient) {}

  getCoins(coins) {
    let coinsList = '';

    coinsList = coins.join();

    return this._http.get(`${this.baseUrl}/pricemulti?fsyms=${coinsList}&tsyms=USD`)
    .map(result => this.result = result);
  }
}
