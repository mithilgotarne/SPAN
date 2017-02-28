import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import firebase from 'firebase';

/*
  Generated class for the AddNotice page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-notice',
  templateUrl: 'add-notice.html'
})
export class AddNoticePage {

  constructor(public viewCtrl: ViewController) { }

  closePage() {
    this.viewCtrl.dismiss();
  }

  create(title, desc) {
    const user = firebase.auth().currentUser;
    if (user) {
      const notice = {
        title: title,
        desc: desc,
        createdTime: firebase.database.ServerValue.TIMESTAMP,
        createdBy: user.uid
      }
      firebase.database().ref('/userNotices/' + user.uid).push(notice);
    }
    this.closePage();
  }

}
