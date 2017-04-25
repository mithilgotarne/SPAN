import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage, PopoverPage } from '../pages/home/home';
import { AddNoticePage } from '../pages/add-notice/add-notice';
import { LoginPage, ResetPasswordPage } from '../pages/login-page/login-page';
import { SettingsPage } from '../pages/settings/settings';
import { RegisterPage } from '../pages/register/register';
import { NoticeDetailsPage } from '../pages/notice-details/notice-details';
import { NoticeSharePage } from '../pages/notice-share/notice-share';
import { NoticeComponent } from '../shared/notice.component';
import { WelcomePage } from '../pages/welcome/welcome';

import { DayPipe } from '../shared/day.pipe';

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
    NoticeDetailsPage,
    NoticeSharePage,
    ResetPasswordPage,
    NoticeComponent,
    DayPipe,
    WelcomePage,
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
    NoticeDetailsPage,
    NoticeSharePage,
    ResetPasswordPage,
    WelcomePage,
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler },]
})
export class AppModule { }
