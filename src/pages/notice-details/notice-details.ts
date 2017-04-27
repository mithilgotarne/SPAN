import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase.service';

import { NoticeSharePage } from '../notice-share/notice-share';
import firebase from 'firebase';
/*
  Generated class for the NoticeDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-notice-details',
  templateUrl: 'notice-details.html',
  providers: [FirebaseService]
})
export class NoticeDetailsPage {

  notice: any;
  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public fs: FirebaseService, public modalCtrl: ModalController) {
    console.log('constructor')
    this.notice = this.navParams.get('notice');
    firebase.database().ref('/notices/' + this.notice.key).once('value').then(snapshot => {
      this.notice = { notice: snapshot.val(), key: snapshot.key }
    })
      .catch(() => {
        this.navCtrl.pop();
      })
    console.log(this.notice)
    this.user = this.navParams.get('user');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter NoticeDetailsPage');
  }

  share() {
    let modal = this.modalCtrl.create(NoticeSharePage, { notice: this.notice, user: this.user, isShared: true });
    modal.onDidDismiss(data => {
      if (data && data.users && data.users.length > 0) {
        this.fs.shareNotice(this.notice, data.users).then(() => {
          console.log('success');
        }).catch((error) => {
          console.log(error);
        });
      }
    });
    modal.present();
  }

  delete() {
    this.fs.deleteNotice(this.notice).then((res) => {
      console.log('success');
      if (this.navCtrl.canGoBack)
        this.navCtrl.pop().then(() => console.log("success back")).catch(() => console.log("error back"));
    }).catch((error) => {
      console.log(error);
    })
  }

}
