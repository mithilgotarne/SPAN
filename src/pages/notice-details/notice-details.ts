import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import firebase from 'firebase';

import { moveIn } from '../../app/animations';
import { Notif } from '../../providers/notif';

/*
  Generated class for the NoticeDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-notice-share',
  animations: [moveIn(),],
  providers: [Notif],
  template: `
  <ion-header>

    <ion-navbar color="primary">
      <ion-title>Share Notice</ion-title>
      <ion-buttons start padding-right>
        <button ion-button icon-only (click)="closePage()">
          <ion-icon name="close"></ion-icon>
        </button>
      </ion-buttons>
    </ion-navbar>

  </ion-header>


  <ion-content>

    <ion-list no-border>

      <ion-item *ngFor="let role of roles">
        <ion-label>{{ role.title }}</ion-label>
        <ion-checkbox color="secondary" [(ngModel)]="role.isChecked" (ionChange)="check()"></ion-checkbox>
      </ion-item>

    </ion-list>

  </ion-content>

  <ion-footer [@moveIn]="state">
    <ion-toolbar color="primary-dark">
      <ion-buttons end padding-right>
        <button ion-button icon-right (click)="send()">
          Send
          <ion-icon name="send"></ion-icon>
        </button>
      </ion-buttons>
    </ion-toolbar>
  </ion-footer>

  `
})
export class NoticeSharePage {

  notice: any;
  user: any;
  state: string = 'visible';

  roles = [
    {
      title: 'Principal',
      isChecked: false
    },
    {
      title: 'HOD',
      isChecked: false
    },
    {
      title: 'Professor',
      isChecked: false
    },
    {
      title: 'Student',
      isChecked: false
    },
  ];

  constructor(public viewCtrl: ViewController, public navParams: NavParams, private notif: Notif) {
    this.notice = navParams.get('notice');
    this.user = navParams.get('user');
    firebase.database().ref('/sharedWith/' + this.notice.$key).on('value', snapshot => {
      const roles = snapshot.val();
      //console.log(roles);
      for (let r of this.roles) {
        //console.log(roles[r.title]);
        if (roles[r.title])
          r.isChecked = true
      }
      //console.log(this.roles);

    });
  }

  check() {
    //console.log(this.roles);

    for (let r of this.roles) {
      if (this.user.role == r.title && !r.isChecked) {
        this.state = 'hidden';
        return;
      }
    }
    this.state = 'visible';
    //console.log(this.state);
    //console.log(this.roles)
  }

  send() {
    var updates = {};
    var key = this.notice['$key'];
    for (let r of this.roles) {
      if (r.title !== this.user.role && r.isChecked) {
        updates['/notices/' + r.title + '/' + key] = {
          title: this.notice.title,
          desc: this.notice.desc,
          createdTime: this.notice.createdTime,
          createdBy: this.notice.createdBy
        };
        updates['/sharedWith/' + key + '/' + r.title] = true;
      } else if (r.title === this.user.role) {
        //do nothing
      } else {
        updates['/notices/' + r.title + '/' + key] = null;
        updates['/sharedWith/' + key + '/' + r.title] = null;
      }
    }
    firebase.database().ref().update(updates).then(() => {
      /*for (let r of this.roles)
        if (r.title !== this.user.role && r.isChecked)
          this.notif.send(r.title, this.notice).subscribe(
            res => { console.log(res) },
            err => {
              console.log(err);
            });*/
    });
    this.viewCtrl.dismiss();
  }

  closePage() {
    this.viewCtrl.dismiss();
  }
}

@Component({
  selector: 'page-notice-details',
  templateUrl: 'notice-details.html'
})
export class NoticeDetailsPage {

  notice: any;
  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticeDetailsPage');
    this.notice = this.navParams.get('notice');
    this.user = this.navParams.get('user');
  }

  share() {
    let modal = this.modalCtrl.create(NoticeSharePage, { notice: this.notice, user: this.user });
    modal.present();
  }

}
