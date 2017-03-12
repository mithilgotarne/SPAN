import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import firebase from 'firebase';
import { Notif } from '../../providers/notif';

/*
  Generated class for the AddNotice page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-notice',
  templateUrl: 'add-notice.html',
  providers: [Notif]
})
export class AddNoticePage {

  constructor(public viewCtrl: ViewController, private notif: Notif) { }

  closePage() {
    this.viewCtrl.dismiss();
  }

  create(title, desc) {
    const user = firebase.auth().currentUser;
    if (user) {
      firebase.database().ref('/users/' + user.uid).once('value', snapshot => {
        const user = snapshot.val();
        const notice = {
          title: title,
          desc: desc,
          createdTime: firebase.database.ServerValue.TIMESTAMP,
          createdBy: user.uid
        }
        var newNoticeKey = firebase.database().ref('/notices/' + user.role).push().key;
        var updates = {};
        updates['/notices/' + user.role + '/' + newNoticeKey] = notice;
        updates['/sharedWith/' + newNoticeKey + '/' + user.role] = true;
        firebase.database().ref().update(updates).then(() => {
          //this.notif.send(user.role, notice).subscribe(res => console.log(res));
        });
      });
    }
    this.closePage();
  }

}
