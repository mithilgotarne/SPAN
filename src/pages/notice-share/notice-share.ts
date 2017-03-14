import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import firebase from 'firebase';

/*
  Generated class for the NoticeShare page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-notice-share',
  templateUrl: 'notice-share.html'
})
export class NoticeSharePage {

  items = [];
  users = [];

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticeSharePage');
    let u = this.navParams.get('users');
    let currentUser = this.navParams.get('user');
    firebase.database().ref('/rolesUsers/' + currentUser.role).once('value').then(snapshots => {
      snapshots.forEach((snapshot) => {
        let role = snapshot.key;
        let list = [];
        snapshot.forEach(user => {
          var val = user.val();
          if (currentUser.uid != val.uid) {
            if (this.isIn(u, val))
              list.push({ key: user.key, val: val, isChecked: true });
            else
              list.push({ key: user.key, val: val, isChecked: false });
          }
        })
        this.items.push({ role: role, list: list });
        /*let val = snapshot.val();
        if (this.isIn(u, val))
          this.items.push({ key: snapshot.key, val: val, isChecked: true });
        else
          this.items.push({ key: snapshot.key, val: val, isChecked: false });*/
      });
      this.users = this.items;
      console.log(this.users);
    });
  }

  isIn(u, val) {
    for (let i of u)
      if (i.uid == val.uid)
        return true;
    return false;
  }

  getItems(ev: any) {
    /*var val = ev.target.value;
    if (val && val.trim() != '') {
      this.users = this.items.filter(item => {
        return (item.val.name.toLowerCase().indexOf(val.toLowerCase()) > -1)
          || (item.val.role.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.users = this.items;
    }*/
  }

  check(pos, key, value) {
    for (var i = 0; i < this.items[pos].length; i++) {
      if (this.items[pos].list[i].key == key) {
        this.items[pos].list[i].isChecked = value;
        break;
      }
    }
  }

  goBack() {
    var data = [];
    for (var i of this.items) {
      for (var j of i.list) {
        if (j.isChecked) {
          data.push(j.val);
        }
      }
    }
    this.viewCtrl.dismiss({ users: data });
  }



}
