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
  u: Array<any>;
  currentUser;
  loadedSharedWith = false;
  notice;

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {

    this.u = this.navParams.get('users');
    this.currentUser = this.navParams.get('user');
    if (!this.u) {
      this.getUsersFromSharedWith();
      this.loadedSharedWith = true;
    } else {
      this.processUsers(false)
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticeSharePage');
  }

  getUsersFromSharedWith() {
    this.u = []
    this.notice = this.navParams.get('notice');
    if (!this.notice)
      return;
    firebase.database().ref('/sharedWith/' + this.notice['key']).once('value').then(snapshots => {
      snapshots.forEach(snapshot => {
        this.u.push(snapshot.val())
      })
      this.processUsers(true);
      console.log(this.u)
    });

  }

  processUsers(disabled: boolean) {
    firebase.database().ref('/rolesUsers/' + this.currentUser.role).once('value').then(snapshots => {
      snapshots.forEach((snapshot) => {
        let role = snapshot.key;
        let list = [];
        snapshot.forEach(user => {
          var val = user.val();
          if (this.currentUser.uid != val.uid) {
            if (this.isIn(this.u, val))
              list.push({ key: user.key, val: val, isChecked: true, isDisabled: disabled });
            else
              list.push({ key: user.key, val: val, isChecked: false, isDisabled: false });
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
    if (!u)
      return false;
    for (let i of u)
      if (i.uid == val.uid)
        return true;
    return false;
  }

  getItems(ev: any) {
    var val = ev.target.value;
    if (val && val.trim() != '') {
      this.users = [];
      for (var role of this.items) {
        //console.log(role.role.toLowerCase());
        if (role.role.toLowerCase().indexOf(val.toLowerCase()) > -1) {
          this.users.push({ role: role.role, list: role.list })
        } else {
          let list = [];
          for (var user of role.list) {
            if (user.val.name.toLowerCase().indexOf(val.toLowerCase()) > -1) {
              if (this.currentUser.uid != user.val.uid) {
                if (this.isIn(this.u, user.val))
                  list.push({ key: user.key, val: user.val, isChecked: true });
                else
                  list.push({ key: user.key, val: user.val, isChecked: false });
              }
            }
          }
          this.users.push({ role: role.role, list: list })
        }
      }
    } else {
      this.users = this.items;

    }
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
    this.viewCtrl.dismiss();
  }
  done() {
    var data = [];
    for (var i of this.items) {
      for (var j of i.list) {
        if (!(this.loadedSharedWith && this.isIn(this.u, j.val)) && j.isChecked) {
          data.push(j.val);
        }
      }
    }
    this.viewCtrl.dismiss({ users: data });
  }

}
