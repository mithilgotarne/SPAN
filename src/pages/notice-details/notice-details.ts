import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase.service';

import { NoticeSharePage } from '../notice-share/notice-share';

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
    public fs: FirebaseService, public modalCtrl: ModalController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticeDetailsPage');
    this.notice = this.navParams.get('notice');
    this.user = this.navParams.get('user');
    console.log(this.notice)
    console.log(this.user)
  }

  share() {
    let modal = this.modalCtrl.create(NoticeSharePage, { notice: this.notice, user: this.user, isShared: true });
    modal.onDidDismiss(data => {
      if (data && data.users) {
        this.fs.shareNotice(this.notice, data.users).then(() => {
          console.log('success');
        }).catch((error) => {
          console.log(error);
        });
      }
    });
    modal.present();
  }

  delete(){
    this.fs.deleteNotice(this.notice).then((res)=>{
      console.log('success');
      this.navCtrl.pop();
    }).catch((error)=>{
      console.log(error);
    })
  }

}
