import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BackgroundMode } from '@ionic-native/background-mode';

import { HomePage } from '../pages/home/home';
import { ApiProvider } from '../providers/api/api';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  public DataArray: Array<Object>;
  coins:any = [
    {name: 'adzcoin'} , {name:'auroracoin-qubit'} , {name:'bitcoin'} ,{name: 'bitcoin-cash'}, 
    {name: 'bitcoin-gold'}, {name: 'bitcoin-private'}, {name: 'dash'}, {name: 'digibyte-groestl'},
    {name: 'digibyte-qubit'}, {name: 'digibyte-skein'}, {name: 'electroneum'}, {name: 'ethereum'},
    {name: 'ethereum-classic'}, {name: 'ethersocial'}, {name: 'expanse'}, {name: 'feathercoin'}, 
    {name: 'gamecredits'}, {name: 'globalboosty'}, {name: 'groestlcoin'}, {name: 'litecoin'},
    {name: 'maxcoin'}, {name: 'monacoin'}, {name: 'monero'}, {name: 'musicoin'}, {name: 'myriadcoin-groestl'},
    {name: 'myriadcoin-skein'}, {name: 'myriadcoin-yescrypt'}, {name: 'sexcoin'}, {name: 'siacoin'},
    {name: 'startcoin'}, {name: 'verge-scrypt'}, {name: 'vertcoin'}, {name: 'zcash'}, {name: 'zclassic'},
    {name: 'zcoin'}, {name: 'zencash'}
  ];
  coins1:any=[];
  rootPage:any=HomePage;
  apikey:any;
  dataprice:any;
  coinsdata:any = [];
  btcusd:any;
  pages: Array<{title: string, component: any}>;
  pcc:any= localStorage.getItem('pcc');
  pfc:any= localStorage.getItem('pfc');
  fcurrency:any= localStorage.getItem('pfcval');;

  constructor(private backgroundMode: BackgroundMode,private api:ApiProvider,public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    if (!this.pcc) {
      this.pcc="BTC";
      localStorage.setItem('pcc', "BTC");
      localStorage.setItem('pccval', "1");
    }
    if (!this.pfc) {
      this.pfc="USD";
      this.fcurrency=1;
      localStorage.setItem('pfcval', "1");
      localStorage.setItem('pfc', "USD");
    }
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home - Balance', component: HomePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      //this.backgroundMode.enable();
      this.getbtcusd();
      this.getItem();
      this.getprices();
      this.getinformations();
      this.getcurrency();
      localStorage.setItem("coins", JSON.stringify(this.coins));
      
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
  getItem() {
    this.apikey = localStorage.getItem('api');
  }

  getprices() { 
    this.api.get('https://miningpoolhub.com/index.php?page=api&action=getminingandprofitsstatistics').map(res => res.json()).subscribe(data => { 
      this.dataprice = data.return.sort(function(a,b){
        return a.coin_name >b.coin_name?1:a.coin_name <b.coin_name?-1:0
      });
      this.setprices();
    });
  }

  getbtcusd() {
    this.api.get('https://api.coinmarketcap.com/v2/ticker/1/').map(res => res.json()).subscribe(data => {
      this.btcusd = data.data.quotes.USD.price;
      localStorage.setItem('btcusd',data.data.quotes.USD.price)
  });
  }
  getinformations() { 
    this.api.get('https://www.datariusapps.tk/mpm.php?notice').map(res => res.json()).subscribe(data => { 
      let info = data;
      localStorage.setItem("info", JSON.stringify(info));
  })
  }

  getcurrency() { 
    this.api.get('https://www.datariusapps.tk/mpm.php?get_currency').map(res => res.json()).subscribe(data => { 
      let info = data;
      localStorage.setItem("allcurrency", JSON.stringify(info));
  })
  }

  setprices() {
    for (var i=0; i<this.dataprice.length; i++){
      localStorage.setItem(this.dataprice[i].coin_name, this.dataprice[i].bittrex_buy_price);
    }
  }

}
