import { Component } from '@angular/core';
import { PopoverController,ToastController ,NavController,NavParams, ModalController,ViewController   } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { OrderPipe } from 'ngx-order-pipe';
import { Clipboard } from '@ionic-native/clipboard';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  apikey:any=localStorage.getItem('api');
  isDisabled:any=false;
  btcprice:any = localStorage.getItem('btcusd');
  page='balance';
  rows:any[];
  prices:any[];
  coindata:any[];
  total:any;
  ftotal:any;
  price:any;
  crate:any;
  fcrate:any;
  coinbtc:any[] = [];
  coins:any = [];
  coins1:any = [];
  coins2:any = [];
  data:any=[];
  order: string = 'coin';
  showdata:any=false;
  task:any;
  task1:any;
  mining:any;
  showdonate:any=false;
  info:any=JSON.parse(localStorage.getItem("info"));
  allcurrencyes:any=JSON.parse(localStorage.getItem("allcurrency"));
  pcc:any= localStorage.getItem('pcc');
  pfc:any= localStorage.getItem('pfc');
  ncurrency:any= localStorage.getItem('pccval');
  fcurrency:any= localStorage.getItem('pfcval');
  constructor(private clipboard: Clipboard,public popoverCtrl: PopoverController , private orderPipe: OrderPipe,private barcodeScanner: BarcodeScanner, public toastCtrl:ToastController,public modalCtrl: ModalController, public navCtrl: NavController, private api:ApiProvider) {

    if (this.pcc==="BTC") {
      this.ncurrency = localStorage.getItem('bitcoin');  
    }  
    if (this.pcc==="LTC") {
      this.ncurrency = localStorage.getItem('litecoin');    
    }
    if (this.pcc==="ETH") {
      this.ncurrency = localStorage.getItem('ethereum');     
    }
    this.coins = [
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
    if (this.apikey) {
      this.page = 'balance';
    }
    if (!this.apikey) {
      this.isDisabled=true;
      this.page = 'settings';
    }

    document.addEventListener('resume', () => {
      this.updatebtcprice();
      this.updatedata();
      setTimeout(function(){
        this.coins1 = this.coins2;
      },5000);
  });
  }
  ionViewDidEnter() {
    this.getcurrency();
    this.allcurrencyes=JSON.parse(localStorage.getItem("allcurrency"));
    this.getfvalue();
    if (this.page=="balance") {
      this.coins1=[];
      this.getinfo();
    }
    this.task = setInterval(() => {
      this.updatebtcprice();
      this.updatedata();
    }, 180000);
    this.task1 = setInterval(() => {
      this.coins1 = this.coins2;
    }, 200000);
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage, {data:this.info});
    popover.present({
      ev: myEvent
    });
  }

  reload() {
      this.coins1=[];
      this.getinfo();
      this.getinformations();
  }

  getinfo() {
    this.coins1=[];
    this.mining=0;
    for (var i=0; i<this.coins.length; i++){
      let name = this.coins[i].name;
      this.api.get('https://'+this.coins[i].name+'.miningpoolhub.com/index.php?page=api&action=getdashboarddata&api_key='+this.apikey).map(res => res.json()).subscribe(data => { 
        let conf = data.getdashboarddata.data.balance.confirmed;
        let unconf = data.getdashboarddata.data.balance.unconfirmed;
        let aeconf = data.getdashboarddata.data.balance_for_auto_exchange.confirmed;
        let aeunconf = data.getdashboarddata.data.balance_for_auto_exchange.unconfirmed;
        let exch = data.getdashboarddata.data.balance_on_exchange;
        let sum =conf+unconf+aeconf+aeunconf+exch;
        let hash = data.getdashboarddata.data.personal.hashrate;
        if (hash != 0) {
          console.log(hash)
          this.mining=this.mining+1;
          console.log(name)
        }
        if (sum !=0 || hash != 0) {
          let cointobtc:any = localStorage.getItem(name);
          this.coins1.push({'coin': name, 'data': data.getdashboarddata.data, 'value':sum*cointobtc,'price':cointobtc });  
          //this.coins1 = this.coins1.sort(function(a,b){
            //return a.coin>b.coin?1:a.coin <b.coin?-1:0
          //});
          this.getvalue();
          this.getfvalue();
        }
    })
  }
}

updatedata() {
  this.getinformations();
  this.updatebtcprice();
  this.coins2=[];
  for (var i=0; i<this.coins.length; i++){
    let name = this.coins[i].name;
    this.api.get('https://'+this.coins[i].name+'.miningpoolhub.com/index.php?page=api&action=getdashboarddata&api_key='+this.apikey).map(res => res.json()).subscribe(data => { 
      let conf = data.getdashboarddata.data.balance.confirmed;
      let unconf = data.getdashboarddata.data.balance.unconfirmed;
      let aeconf = data.getdashboarddata.data.balance_for_auto_exchange.confirmed;
      let aeunconf = data.getdashboarddata.data.balance_for_auto_exchange.unconfirmed;
      let exch = data.getdashboarddata.data.balance_on_exchange;
      let sum =conf+unconf+aeconf+aeunconf+exch;
      if (sum !=0 ) {
        let cointobtc:any = localStorage.getItem(name);
        this.coins2.push({'coin': name, 'data': data.getdashboarddata.data,'value':sum*cointobtc, 'price':cointobtc });  
        this.coins2 = this.coins2.sort(function(a,b){
          return a.coin>b.coin?1:a.coin <b.coin?-1:0
        });
        this.getvalue();
        this.getfvalue();
      }
  })
}

}
updatebtcprice() {
  this.api.get('https://api.coinmarketcap.com/v2/ticker/1/').map(res => res.json()).subscribe(data => {
    this.btcprice = data.data.quotes.USD.price;;
    localStorage.setItem('btcusd',data.data.quotes.USD.price)
});
}

getinformations() { 
    this.api.get('https://www.datariusapps.tk/mpm.php?notice').map(res => res.json()).subscribe(data => { 
      this.info = data;
  })
  }

  presentcoin(data) {
    let contactModal = this.modalCtrl.create(CoinDetails, 
      {
      'api' : this.apikey,
      'coinname': data.coin,
      'data' : data.data}
    );
    contactModal.present();
}   
  
  getvalue() {
    this.total=0;
    for (var i=0; i<this.coins1.length; i++) {
      let conf = this.coins1[i].data.balance.confirmed;
      let unconf = this.coins1[i].data.balance.unconfirmed;
      let aeconf = this.coins1[i].data.balance_for_auto_exchange.confirmed;
      let aeunconf = this.coins1[i].data.balance_for_auto_exchange.unconfirmed;
      let exch = this.coins1[i].data.balance_on_exchange;
      let sum =conf+unconf+aeconf+aeunconf+exch;
      this.price = this.coins1[i].price
      this.crate = sum*this.price;
      this.total = this.total + this.crate;
    };
    if (this.pcc==="BTC") {
      this.total = this.total;   
    }  
    if (this.pcc==="LTC") {
      this.ncurrency = localStorage.getItem('litecoin');
      this.total = this.total / this.ncurrency;      
    }
    if (this.pcc==="ETH") {
      this.ncurrency = localStorage.getItem('ethereum');
      this.total = this.total / this.ncurrency;      
    }
  }
  getfvalue() {
    this.ftotal=0;
    for (var i=0; i<this.coins1.length; i++) {
      let conf = this.coins1[i].data.balance.confirmed;
      let unconf = this.coins1[i].data.balance.unconfirmed;
      let aeconf = this.coins1[i].data.balance_for_auto_exchange.confirmed;
      let aeunconf = this.coins1[i].data.balance_for_auto_exchange.unconfirmed;
      let exch = this.coins1[i].data.balance_on_exchange;
      let sum =conf+unconf+aeconf+aeunconf+exch;
      this.price = this.coins1[i].price
      this.fcrate = sum*this.price;
      this.ftotal = this.ftotal + this.fcrate;
    };  
  } 

  getcurrency() { 
    this.api.get('https://www.datariusapps.tk/mpm.php?get_currency').map(res => res.json()).subscribe(data => { 
      let info = data;
      this.allcurrencyes = data;
      localStorage.setItem("allcurrency", JSON.stringify(info));
  })
  }

  scanapi() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.apikey = barcodeData.text;
      this.saveapi(barcodeData.text);
      console.log('Barcode data', barcodeData);
     }).catch(err => {
         console.log('Error', err);
     });
  }

  saveapi(data) {
    let saveapi = localStorage.setItem('api', data);
    if (!data) {
      this.rows=null;
      this.isDisabled=true;
    }
    if(data) {
      if(this.pcc=="BTC") {
        this.ncurrency=1;
      }
      if(this.pfc=="USD") {
        this.ncurrency=1;
      }
      console.log(this.ncurrency);
      console.log(this.fcurrency);
      this.isDisabled=false;
      this.getinfo();
      this.updatedata();
      this.page = 'balance'          
    }
  }

  setpcc(data) {
    this.pcc=data;
    localStorage.setItem('pcc', data);
    if (this.pcc==="BTC") {
      this.ncurrency = localStorage.getItem('bitcoin');  
    }  
    if (this.pcc==="LTC") {
      this.ncurrency = localStorage.getItem('litecoin');    
    }
    if (this.pcc==="ETH") {
      this.ncurrency = localStorage.getItem('ethereum');     
    }
    this.getvalue();
  }
  setpfc(data) {
    console.log(data);
    this.pfc=data;
    localStorage.setItem('pfc', data);
    for(let i=0;i<this.allcurrencyes.length ;i++){ 
      if(this.allcurrencyes[i].c_name_short==data) {
        this.fcurrency = this.allcurrencyes[i].c_usdtocurr;
        localStorage.setItem('pfcval', this.allcurrencyes[i].c_usdtocurr);
      }
    }
  }
  copy(data) {
    this.clipboard.copy(data);
    this.showMsg();
    console.log(data);
  }
  showMsg() {
    let toast = this.toastCtrl.create({
        message: 'Copied to clipboard',
        duration: 2000,
        position: 'bottom'
    });
    toast.present();
  }
}

@Component({
  selector: 'page-home1',
  template: `
  <ion-header>
  <ion-navbar>
  <ion-buttons left>
      <button ion-button (click)="dismiss()" style="font-size: 150%;">
          <ion-icon name="arrow-back"></ion-icon>
      </button>
  </ion-buttons>
  <ion-title text-uppercase>{{coinname}}</ion-title>
</ion-navbar>
  </ion-header>
  <ion-content style="background-color:#ebebeb">

    <div style="margin-top:1%;margin-left:2%;margin-right:2%;background-color: #fff;border: 1px solid #f2f2f2;border-radius: 10px; -moz-border-radius: 10px; -webkit-border-radius: 10px ;">
      <ion-row>
        <ion-col col-1 style="padding-left:5%;padding-top:3%;">
          <ion-icon name="podium" style="font-size: 1.5em;color:#003662"></ion-icon>
        </ion-col>
        <ion-col col-11 style="padding-left:4%;vertical-align: middle;display: flex!important; padding-top:4%;">
          <span style="color:#003662;"><b>Hashrate</b></span>
        </ion-col>
      </ion-row>       
      <ion-row>
        <ion-col col-6 text-center>
        <span style="color:#003662;"><b>My hashrate</b></span>
        </ion-col>
        <ion-col col-6 text-center>
          <span style="color:#003662;"><b>Pool hashrate</b></span>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col col-6 text-center no-padding>
        <h3 style="width: 100%; text-align: center;color:#0084d4;margin-top:0.5rem;margin-bottom:0.5rem">{{myhashrate | number: '1.2-2'}} <span *ngIf="mytype==0" style="font-size: 70%;color:#003662">KH/s</span><span *ngIf="mytype==1" style="font-size: 70%;color:#003662">MH/s</span><span *ngIf="mytype==2" style="font-size: 70%;color:#003662">GH/s</span><span *ngIf="mytype==3" style="font-size: 70%;color:#003662">TH/s</span></h3>
        </ion-col>
        <ion-col col-6 text-center no-padding>
        <h3 style="width: 100%; text-align: center;color:#0084d4;margin-top:0.5rem;margin-bottom:0.5rem">{{poolhashrate | number: '1.2-2'}} <span *ngIf="pooltype==0" style="font-size: 70%;color:#003662">KH/s</span><span *ngIf="pooltype==1" style="font-size: 70%;color:#003662">MH/s</span><span *ngIf="pooltype==2" style="font-size: 70%;color:#003662">GH/s</span><span *ngIf="pooltype==3" style="font-size: 70%;color:#003662">TH/s</span></h3>
        </ion-col>
      </ion-row>
    </div>

    <div *ngIf="showactiveworkers" style="margin-top:1%;margin-left:2%;margin-right:2%;background-color: #fff;border: 1px solid #f2f2f2;border-radius: 10px; -moz-border-radius: 10px; -webkit-border-radius: 10px ;">
      <ion-row>
        <ion-col col-1 style="padding-left:5%;padding-top:3%;">
          <ion-icon name="people" style="font-size: 1.5em;color:#003662"></ion-icon>
        </ion-col>
        <ion-col col-11 style="padding-left:4%;vertical-align: middle;display: flex!important; padding-top:4%;">
          <span style="color:#003662;"><b>Active workers</b></span>
        </ion-col>
      </ion-row>       
      <ion-row *ngFor="let aw of activeworkers">
        <ion-col col-12 text-center no-padding>
        <h3 style="width: 100%; text-align: center;color:#0084d4;margin-top:0.5rem;margin-bottom:0.5rem">{{aw.worker}}</h3>
        </ion-col>
      </ion-row>
    </div>

    <div  *ngIf="data.personal?.estimates?.block>0 || data.personal?.estimates?.donation>0 || data.personal?.estimates?.fee>0 || data.personal?.estimates?.payout>0" style="margin-top:1%;margin-left:2%;margin-right:2%;background-color: #fff;border: 1px solid #f2f2f2;border-radius: 10px; -moz-border-radius: 10px; -webkit-border-radius: 10px ;">
      <ion-row>
        <ion-col col-1 style="padding-left:5%;padding-top:3%;">
          <ion-icon name="clock" style="font-size: 1.5em;color:#003662"></ion-icon>
        </ion-col>
        <ion-col col-11 style="padding-left:4%;vertical-align: middle;display: flex!important; padding-top:4%;">
          <span style="color:#003662;"><b>Round estimates</b></span>
        </ion-col>
      </ion-row>         
      <ion-row>
        <ion-col col-12 text-center no-padding>
          <ion-item no-lines style="padding-top:3%;">
            <p style="font-size: 1.3rem;color:#0084d4;"><b>Block: </b><span style="float:right;color:#003662;"><b>{{data.personal?.estimates?.block | number: '1.8-8'}}</b></span></p>
            <p style="font-size: 1.3rem;color:#0084d4;"><b>Donation: </b><span style="float:right;color:#003662;"><b>{{data.personal?.estimates?.donation | number: '1.8-8'}}</b></span></p>
            <p style="font-size: 1.3rem;color:#0084d4;"><b>Fee: </b><span style="float:right;color:#003662;"><b>{{data.personal?.estimates?.fee | number: '1.8-8'}}</b></span></p>
            <p style="font-size: 1.3rem;color:#0084d4;"><b>Payout: </b><span style="float:right;color:#003662;"><b>{{data.personal?.estimates?.payout | number: '1.8-8'}}</b></span></p>
          </ion-item>
        </ion-col>
      </ion-row>
    </div>

    <div *ngIf="data.balance?.confirmed>0 || data.balance?.unconfirmed>0 || data.balance_for_auto_exchange?.confirmed>0 || data.balance_for_auto_exchange?.unconfirmed>0 || data.balance_on_exchange>0" style="margin-top:1%;margin-left:2%;margin-right:2%;background-color: #fff;border: 1px solid #f2f2f2;border-radius: 10px; -moz-border-radius: 10px; -webkit-border-radius: 10px ;">
      <ion-row>
        <ion-col col-1 style="padding-left:5%;padding-top:3%;">
          <ion-icon name="briefcase" style="font-size: 1.5em;color:#003662"></ion-icon>
        </ion-col>
        <ion-col col-11 style="padding-left:4%;vertical-align: middle;display: flex!important; padding-top:4%;">
          <span style="color:#003662;"><b>Wallet information</b></span>
        </ion-col>
      </ion-row>        
      <ion-row>
      <ion-segment [(ngModel)]="wallets" mode="ios">
        <ion-segment-button value="normal">
          Normal
        </ion-segment-button>
        <ion-segment-button value="autoexchange">
        AutoExchange
        </ion-segment-button>
        <ion-segment-button value="exchange">
        On Exchange
        </ion-segment-button>
      </ion-segment>
        <ion-col col-12 text-center no-padding>
        <div [ngSwitch]="wallets">
          <h3 *ngSwitchCase="'normal'" style="width: 100%; text-align: center;color:#0084d4;margin-top:0.5rem;margin-bottom:0.5rem">{{data.balance?.confirmed | number: '1.8-8'}} ({{data.balance?.unconfirmed | number: '1.8-8'}})</h3>
          <h3 *ngSwitchCase="'autoexchange'" style="width: 100%; text-align: center;color:#0084d4;margin-top:0.5rem;margin-bottom:0.5rem">{{data.balance_for_auto_exchange?.confirmed | number: '1.8-8'}} ({{data.balance_for_auto_exchange?.unconfirmed | number: '1.8-8'}})</h3>
          <h3 *ngSwitchCase="'exchange'" style="width: 100%; text-align: center;color:#0084d4;margin-top:0.5rem;margin-bottom:0.5rem">{{data.balance_on_exchange | number: '1.8-8'}}</h3>
        </div>
        </ion-col>
      </ion-row>
    </div>

    <div style="margin-top:1%;margin-left:2%;margin-right:2%;background-color: #fff;border: 1px solid #f2f2f2;border-radius: 10px; -moz-border-radius: 10px; -webkit-border-radius: 10px ;">
      <ion-row>
        <ion-col col-1 style="padding-left:5%;padding-top:3%;">
          <ion-icon name="calculator" style="font-size: 1.5em;color:#003662"></ion-icon>
        </ion-col>
        <ion-col col-11 style="padding-left:4%;vertical-align: middle;display: flex!important; padding-top:4%;">
          <span style="color:#003662;"><b>Credits - last 24 hours</b></span>
        </ion-col>
      </ion-row>      
      <ion-row>
        <ion-col col-12 text-center no-padding>
          <h3 style="width: 100%; text-align: center;color:#0084d4;margin-top:0.5rem;margin-bottom:0.5rem">{{recentcredits | number: '1.8-8'}}</h3>
        </ion-col>
      </ion-row>
    </div>

    <div style="margin-top:1%;margin-left:2%;margin-right:2%;background-color: #fff;border: 1px solid #f2f2f2;border-radius: 10px; -moz-border-radius: 10px; -webkit-border-radius: 10px ;">
    <ion-row>
      <ion-col col-1 style="padding-left:5%;padding-top:3%;">
        <ion-icon name="calculator" style="font-size: 1.5em;color:#003662"></ion-icon>
      </ion-col>
      <ion-col col-11 style="padding-left:4%;vertical-align: middle;display: flex!important; padding-top:4%;">
        <span style="color:#003662;"><b>Recent daily credits</b></span>
      </ion-col>
    </ion-row>
    <ion-item no-lines style="padding-top:3%;">
      <span *ngFor="let cr of recentcredits10">
        <p style="font-size: 1.3rem;color:#0084d4;"><b>{{cr.date  | date:'dd/MM/yyyy'}} </b><span style="float:right;color:#003662;"><b>{{cr.amount | number: '1.8-8'}}</b></span></p>
      </span>
    </ion-item>

  </div>
</ion-content>`
})
export class CoinDetails {
  wallets:any="normal";
  apikey:any;
  coinname:any;
  btcprice = localStorage.getItem('btcusd');
  recentcredits:any;
  recentcredits10:any;
  coindata:any;
  hours24:any;
  balanceconfirmed:any;
  balanceunconfirmed:any;
  aebalanceconfirmed:any;
  aebalanceunconfirmed:any;
  exchange:any;
  personal:any;
  miningdata:any;
  data:any;
  myhashrate:any;
  poolhashrate:any;
  mytype:any;
  pooltype:any;
  activetype:any;
  activeworkers:any;
  activeworkerhashrate:any;
  showactiveworkers:any=false;
  pcc:any= localStorage.getItem('pcc');
  pfc:any= localStorage.getItem('pfc');
  ncurrency:any= localStorage.getItem('pccval');
  fcurrency:any= localStorage.getItem('pfcval');
  constructor(private api:ApiProvider,public viewCtrl: ViewController,params: NavParams) {
    this.apikey = params.get('api');
    this.coinname = params.get('coinname');
    this.data = params.get('data');
    this.myhashrate = this.data.raw.personal.hashrate;
    this.poolhashrate = this.data.raw.pool.hashrate;
    this.recentcredits = this.data.recent_credits_24hours.amount;
    this.recentcredits10 =  this.data.recent_credits;
  }
  ionViewDidLoad() {
    this.workers();
    this.myhash();
    this.poolhash();
  }
  myhash() {
    this.mytype=0;
    while(this.myhashrate > 1000) {
      this.myhashrate=this.myhashrate / 1000;
      if(this.myhashrate>1) {
        this.mytype=this.mytype+1;
      }
    }
  }
  poolhash() {
    this.pooltype=0;
    while(this.poolhashrate > 1000) {
      this.poolhashrate=this.poolhashrate / 1000;
      if(this.poolhashrate>1) {
        this.pooltype=this.pooltype+1;
      }
    }
  }

  workers() {
    this.api.get('https://'+this.coinname+'.miningpoolhub.com/index.php?page=api&action=getuserworkers&api_key='+this.apikey).map(res => res.json()).subscribe(data => {
      this.activeworkers=[];
      this.workers = data.getuserworkers.data;
      for (var i=0; i<this.workers.length; i++){
        if (this.workers[i].hashrate != 0) {
          this.showactiveworkers=true;
          this.calculateworker(this.workers[i].hashrate,this.workers[i].username);
        } 
      }
  });
}

calculateworker(activeworkerhashrate,username) {
  this.activetype=0;
  while(activeworkerhashrate > 1000) {
    activeworkerhashrate=activeworkerhashrate / 1000;
    if(activeworkerhashrate>1) {
      this.activetype=this.activetype+1;
    }
  }
  this.activeworkers.push({'worker': username, 'speed': activeworkerhashrate, 'type': this.activetype });
}

   dismiss() {
     this.viewCtrl.dismiss();
   }
}

@Component({
  template: `
    <ion-list>
        <ion-item text-wrap *ngFor="let i of info">
        <span *ngIf="i!=''"> {{i}}</span></ion-item>
    </ion-list>
  `
})
export class PopoverPage {
  info:any;
  constructor(public navParams:NavParams,public viewCtrl: ViewController) {
    this.info = this.navParams.get('data');
  }

  close() {
    this.viewCtrl.dismiss();
  }
}