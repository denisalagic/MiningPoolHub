import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { OrderModule } from 'ngx-order-pipe';

import { MyApp } from './app.component';
import { HomePage, CoinDetails, PopoverPage } from '../pages/home/home';
import { ApiProvider } from '../providers/api/api'
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Clipboard } from '@ionic-native/clipboard';
import { BackgroundMode } from '@ionic-native/background-mode';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


@NgModule({
  declarations: [
    MyApp,
    HomePage,CoinDetails,PopoverPage

  ],
  imports: [
    OrderModule,
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,CoinDetails,PopoverPage
  ],
  providers: [
    BackgroundMode,
    BarcodeScanner,
    Clipboard,
    ApiProvider,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
