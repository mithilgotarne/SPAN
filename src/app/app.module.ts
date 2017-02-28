import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage, PopoverPage } from '../pages/home/home';
import { AddNoticePage } from '../pages/add-notice/add-notice';
import { LoginPage } from '../pages/login-page/login-page';
import { SettingsPage } from '../pages/settings/settings';
import { RegisterPage } from '../pages/register/register';

import { MaterialModule } from '@angular/material';
import 'hammerjs';

import { AngularFireModule } from 'angularfire2';

export const firebaseConfig = {
  apiKey: "AIzaSyANRmKTiHEyGvAYN9kIqS5CD7frgx5M3q4",
  authDomain: "span-cf33a.firebaseapp.com",
  databaseURL: "https://span-cf33a.firebaseio.com",
  storageBucket: "span-cf33a.appspot.com",
  messagingSenderId: "753783481153"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AddNoticePage,
    LoginPage,
    PopoverPage,
    SettingsPage,
    RegisterPage,
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    MaterialModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AddNoticePage,
    LoginPage,
    PopoverPage,
    SettingsPage,
    RegisterPage,
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler },]
})
export class AppModule { }
