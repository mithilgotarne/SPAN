import { Component, ViewChild } from '@angular/core';

import {
  NavController, NavParams,
  ModalController, ToastController, Platform, PopoverController, ViewController
} from 'ionic-angular';
import firebase from 'firebase';

import { NoticeDetailsPage } from '../notice-details/notice-details';
import { WelcomePage } from '../welcome/welcome';
import { AddNoticePage } from '../add-notice/add-notice';
import { SettingsPage } from '../settings/settings';
import { Firebase } from '@ionic-native/firebase';

import { moveIn } from '../../app/animations';

import { FirebaseAuthState, AngularFireAuth } from 'angularfire2';

import { FirebaseService } from '../../providers/firebase.service';


@Component({
  template: `
      <!--button ion-item (click)="settings()">Settings</button-->
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
  animations: [moveIn()],
  providers: [FirebaseService, Firebase]
})
export class HomePage {

  notices = [];
  state: FirebaseAuthState;
  user;
  userCallback;
  noticeCallback;
  noticeDeletedCallback;
  sideRoot: any;
  @ViewChild('sideNav') sideNav: NavController;

  constructor(public navCtrl: NavController,
    private params: NavParams,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private fs: FirebaseService,
    public popoverCtrl: PopoverController,
    private firebase: Firebase,
    private platform: Platform) {
    this.sideRoot = WelcomePage
  }

  ionViewDidLoad() {
    this.state = this.params.get('state');
    this.userCallback = firebase.database().ref('/users/' + this.state.uid).on('value', (user) => {
      this.user = user.val();
      this.platform.ready().then(() => {
        if (this.platform.is('cordova')) {
          this.firebase.getToken()
            .then(token => this.updateToken(token)) // save the token server-side and use it to push notifications to this device
            .catch(error => console.log(error));

          this.firebase.onTokenRefresh()
            .subscribe((token: string) => this.updateToken(token));
        }
      })
    });
    if (this.state) {
      this.toastCtrl.create({
        message: 'Signed in as ' + this.state.auth.email,
        duration: 3000,
      }).present();
      this.noticeCallback = firebase.database().ref('/userNotices/' + this.state.uid).on('child_added', snapshot => {
        this.notices.unshift({ notice: snapshot.val(), key: snapshot.key })
      });
      this.noticeDeletedCallback = firebase.database().ref('/notices/' + this.state.uid).on('child_removed', snapshot => {
        for (let i = 0; i < this.notices.length; i++) {
          if (this.notices[i]['key'] == snapshot.key) {
            this.notices.splice(i, 1);
            break;
          }
        }
      });
    }
  }

  ionViewWillUnload() {
    firebase.database().ref('/users/' + this.state.uid).off('value', this.userCallback);
    firebase.database().ref('/userNotices/' + this.state.uid).off('child_added', this.noticeCallback);
  }

  updateToken(token) {
    this.fs.updateUserProperty('token', token).then(() => { console.log('Success') });
  }

  addNewNotice() {
    let addModal = this.modalCtrl.create(AddNoticePage, { user: this.user });
    addModal.present();
  }

  openNotice(notice) {
    if (this.platform.is('core')) {
      this.sideNav.push(NoticeDetailsPage, { notice: notice, user: this.user });
      console.log(notice);
    }
    else {
      this.navCtrl.push(NoticeDetailsPage, { notice: notice, user: this.user });
    }
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
