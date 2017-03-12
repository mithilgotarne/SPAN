import { Component } from '@angular/core';

import { Splashscreen } from 'ionic-native';

import {
  NavController, NavParams,
  ModalController, ToastController, Platform, PopoverController, ViewController
} from 'ionic-angular';
import firebase from 'firebase';

import { NoticeDetailsPage } from '../notice-details/notice-details';

import { AddNoticePage } from '../add-notice/add-notice';
import { SettingsPage } from '../settings/settings';
import { Firebase } from 'ionic-native';

import { moveIn } from '../../app/animations';

import {
  AngularFire, AngularFireAuth, FirebaseListObservable, FirebaseObjectObservable,
  FirebaseAuthState
} from 'angularfire2';


@Component({
  template: `
      <button ion-item (click)="settings()">Settings</button>
      <button ion-item (click)="logout()">Sign out</button>
  `
})
export class PopoverPage {
  constructor(public viewCtrl: ViewController,
    private auth: AngularFireAuth,
    public navCtrl: NavController) { }

  logout() {
    this.auth.logout().catch(err => {
      console.log(err);
    });
    this.viewCtrl.dismiss();
  }
  settings() {
    this.viewCtrl.dismiss({ page: SettingsPage });
  }
}


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [moveIn()]
})
export class HomePage {

  notices: FirebaseListObservable<any>;
  state: FirebaseAuthState;
  user: FirebaseObjectObservable<any>;

  constructor(public navCtrl: NavController,
    private params: NavParams,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    public popoverCtrl: PopoverController,
    private af: AngularFire,
    private platform: Platform) {

    this.state = this.params.get('state');
    this.af.database.object('/users/' + this.state.uid).subscribe(user => {
      this.user = user;
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

      if (this.state) {
        this.toastCtrl.create({
          message: 'Signed in as ' + this.state.auth.email,
          duration: 3000,
        }).present();
        this.notices = this.af.database.list('/notices/' + this.user['role']);
      }
    },
    err => {
      console.log(err);
    });
  }

  ionViewWillEnter() {

  }

  updateToken(token) {
    this.user.update({ token: token });
  }

  addNewNotice() {
    let addModal = this.modalCtrl.create(AddNoticePage);
    addModal.present();
  }

  openNotice(notice) {
    this.navCtrl.push(NoticeDetailsPage, { notice: notice, user: this.user });
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.onDidDismiss(data => {
      if (data && data['page'])
        this.navCtrl.push(data['page']);
    });
    popover.present({
      ev: myEvent
    });
  }

}
