import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';
import { LoadingController } from 'ionic-angular';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  detailToggle = [];
  objectKeys = Object.keys;
  coins: any[];
  details: Object;
  likedCoins = ['BTC','ETH','IOT'];
  chart = [];

  constructor( 
    public navCtrl: NavController, 
    private _dataProvider: DataProvider, 
    private storage: Storage,
    public loading: LoadingController
  ) {
    this.storage.remove('likedCoins');
  }

  ionViewWillEnter() {
    this.refreshCoins();
  }

  refreshCoins() {
    let loader = this.loading.create({
      content: 'Refreshing..',
      spinner: 'bubbles'
    });

    loader.present().then(() => {
      this.storage
      .get('likedCoins')
      .then(val => {
          if(val) {
            return val;
          } else {
            this.storage.set('likedCoins', this.likedCoins);
            return this.likedCoins;
          }
      })
      .then((coins) => {
        this._dataProvider.getCoins(coins)
        .subscribe(res => {
          debugger;
          // this.coins = res;
          console.log(this.coins);
          loader.dismiss();
        })
      })
    });
  }

  coinDetails(coin,index) {
    if (this.detailToggle[index])
      this.detailToggle[index] = false;
    else {
      this.detailToggle.fill(false);
      this._dataProvider.getCoin(coin)
        .subscribe(res => {
          this.details = res['DISPLAY'][coin]['USD'];

          this.detailToggle[index] = true;

          this._dataProvider.getChart(coin)
          .subscribe(res => {
  
            let coinHistory = res['Data'].map((a) => (a.close));
            
            setTimeout(()=> {
              const chartOptions = {
                tooltips: {
                  callbacks: {
                      label: function(tooltipItems, data) {
                          return "$" + tooltipItems.yLabel.toString();
                      }
                    }
                  },
                  responsive: true, 
                  legend: {
                    display: false
                },
                scales: {
                  xAxes: [{
                    display: false
                  }],
                  yAxes: [{
                    display: false
                  }],
                }
              };

              this.chart[index] = new Chart('canvas'+index, {
                type: 'line',
                data: {
                  labels: coinHistory,
                  datasets: [{ 
                      data: coinHistory,
                      borderColor: "#3cba9f",
                      fill: false
                    }
                  ]
                },
                options: chartOptions
              });
            }, 250);
          });
        });
      }
  }

  swiped(index) {
    this.detailToggle[index] = false;
  }

  removeCoin(coin) {
    this.detailToggle.fill(false);

    this.likedCoins = this.likedCoins.filter(function(item) {
      return item !== coin
    });

    this.storage.set('likedCoins', this.likedCoins);

    setTimeout(() => {
      this.refreshCoins();
    }, 300);
  }

  showSearch() {
    this.navCtrl.push(SearchPage);
  }
}
