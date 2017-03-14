import { Component } from '@angular/core';
import { ModalController, ViewController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { FirebaseService } from '../../providers/firebase.service';
import { NoticeSharePage } from '../notice-share/notice-share';

/*
  Generated class for the AddNotice page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-notice',
  templateUrl: 'add-notice.html',
  providers: [FirebaseService]
})
export class AddNoticePage {

  user: any;
  selectedUsers = [];
  sendText = "No users seleced";

  constructor(public viewCtrl: ViewController, public modalCtrl: ModalController,
    navParams: NavParams, private fs: FirebaseService) {
    this.user = navParams.get('user');
  }

  closePage() {
    this.viewCtrl.dismiss();
  }

  tag() {
    let modal = this.modalCtrl.create(NoticeSharePage, {user: this.user, users : this.selectedUsers});
    modal.onDidDismiss(data => {
      if (data && data.users) {
        this.selectedUsers = data.users;
        if (this.selectedUsers.length > 0) {
          let str = "";
          if (this.selectedUsers.length == 1)
            str = this.selectedUsers[0].name;
          else if (this.selectedUsers.length == 2)
            str = this.selectedUsers[0].name + ", " + this.selectedUsers[1].name;
          else {
            str = this.selectedUsers[0].name + " and " + (this.selectedUsers.length - 1) + " others";
          }
          this.sendText = str;
        }else{
          this.sendText = "No users seleced";
        }
      }
    })
    modal.present();
  }

  create(title, desc) {
    const notice = {
      title: title,
      desc: desc,
      createdTime: firebase.database.ServerValue.TIMESTAMP,
      createdBy: this.user
    }
    this.closePage();
  }

}