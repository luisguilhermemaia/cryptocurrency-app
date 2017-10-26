import { Storage } from "@ionic/storage/es2015/storage";
import { DataProvider } from "./../../providers/data/data";
import { Component } from "@angular/core";
import { NavController } from "ionic-angular";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  objectKeys = Object.keys;
  coins: Object;
  likedCoins = ["BTC", "ETH", "IOT"];

  constructor(
    public navCtrl: NavController,
    private _data: DataProvider,
    private storage: Storage
  ) {}

  ionViewDidLoad() {}

  ionViewWillEnter() {
    this.refreshCoins()
  }

  refreshCoins() {
    this.storage.get("likedCoins").then(val => {
      val ? this.likedCoins = val :  this.storage.set("likedCoins", this.likedCoins);

      this._data.getCoins(this.likedCoins).subscribe(res => this.coins = res);
    });
  }
}
