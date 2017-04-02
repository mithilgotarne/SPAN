import { Component,ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { LoginPage } from '../pages/login-page/login-page';
import { HomePage } from '../pages/home/home';
import { AngularFireAuth, FirebaseAuthState } from 'angularfire2';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('mainNav') navCtrl: NavController;

  constructor(platform: Platform, auth: AngularFireAuth) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //StatusBar.styleDefault();
      if (platform.is('android')) {
        StatusBar.backgroundColorByHexString("#6F8996");
      }
      
    });

    auth.subscribe((state: FirebaseAuthState) => {
      if (state) {
        this.navCtrl.setRoot(HomePage, { state: state });
      } else {
        this.navCtrl.setRoot(LoginPage);
      }
    }, err => {
      this.navCtrl.setRoot(LoginPage);
    });

  }
}
