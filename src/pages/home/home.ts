import { Component } from '@angular/core';

import { Splashscreen } from 'ionic-native';

import { NavController, ModalController, AlertController, Platform } from 'ionic-angular';

import { AddNoticePage } from '../add-notice/add-notice';

import { Firebase } from 'ionic-native';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items = [];
  token = "";
  constructor(public navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private platform: Platform) {
    platform.ready().then(() => {
      if (platform.is('cordova')) {
        Firebase.getToken()
          .then(token => this.token = token) // save the token server-side and use it to push notifications to this device
          .catch(error => this.token = error);

        Firebase.onTokenRefresh()
          .subscribe((token: string) => this.token = token);

        Splashscreen.hide();
      }
    });
  }

  ionViewWillEnter() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (localStorage.getItem('items') == null) {
      localStorage.setItem('items', '[]');
    }
    this.items = JSON.parse(localStorage.getItem('items'));
  }

  addNewNotice() {
    let addModal = this.modalCtrl.create(AddNoticePage);
    addModal.onDidDismiss(data => {
      if (data)
        this.items = data.items;
    });
    addModal.present();
  }

}
