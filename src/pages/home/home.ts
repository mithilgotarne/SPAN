import { Component } from '@angular/core';

import { Splashscreen } from 'ionic-native';

import {
  NavController, NavParams,
  ModalController, ToastController, Platform, PopoverController, ViewController
} from 'ionic-angular';

import { AddNoticePage } from '../add-notice/add-notice';
import { Firebase } from 'ionic-native';

import { AngularFire, AngularFireAuth, FirebaseAuthState } from 'angularfire2';

@Component({
  template: `
      <button ion-item (click)="logout()">Sign out</button>
  `
})
export class PopoverPage {
  constructor(public viewCtrl: ViewController, private auth: AngularFireAuth, private navCtrl: NavController) { }

  logout() {
    this.auth.logout().catch(err => {
      console.log(err);
    });
    this.viewCtrl.dismiss();
  }
}


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items = [];
  state: FirebaseAuthState;

  constructor(public navCtrl: NavController,
    private params: NavParams,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    public popoverCtrl: PopoverController,
    private af: AngularFire,
    private platform: Platform) {

    this.state = this.params.get('state');

    platform.ready().then(() => {
      if (platform.is('cordova')) {
        Firebase.getToken()
          .then(token => this.updateToken(token)) // save the token server-side and use it to push notifications to this device
          .catch(error => console.log(error));

        Firebase.onTokenRefresh()
          .subscribe((token: string) => this.updateToken(token));

        Splashscreen.hide();
      }
    });
  }

  ionViewWillEnter() {
    if (localStorage.getItem('items') == null) {
      localStorage.setItem('items', '[]');
    }
    this.items = JSON.parse(localStorage.getItem('items'));
    if (this.state) {
      this.toastCtrl.create({
        message: 'Signed in as ' + this.state.auth.email,
        duration: 3000,
      }).present();
    }
  }

  updateToken(token) {
    const user = this.af.database.object('/users/' + this.state.uid);
    user.update({ email: this.state.auth.email, token: token });
  }

  addNewNotice() {
    let addModal = this.modalCtrl.create(AddNoticePage);
    addModal.onDidDismiss(data => {
      if (data)
        this.items = data.items;
    });
    addModal.present();
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }

}
