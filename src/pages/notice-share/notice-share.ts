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
  isCheckAll = true;

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
        this.u.push({ uid: snapshot.key })
      })
      this.processUsers(true);
      console.log(this.u)
    });

  }

  processUsers(disabled: boolean) {
    firebase.database().ref('/users/').orderByChild("r_value")
      .startAt(this.currentUser.r_value).once('value').then(snapshot => {
        snapshot.forEach(user => {
          var val = user.val();
          let pos = this.addRole(val.role);
          if (this.currentUser.uid != val.uid) {
            if (this.isIn(this.u, val))
              this.items[pos].list.push({ key: user.key, val: val, isChecked: true, isDisabled: disabled });
            else
              this.items[pos].list.push({ key: user.key, val: val, isChecked: false, isDisabled: false });
          }
        })
        //this.items.push({ role: role, list: list, isChecked: false });
        /*let val = snapshot.val();
        if (this.isIn(u, val))
          this.items.push({ key: snapshot.key, val: val, isChecked: true });
        else
          this.items.push({ key: snapshot.key, val: val, isChecked: false });*/
        this.users = this.items;
        console.log(this.users);
      });
  }

  addRole(role) {
    let i;
    for (i = 0; i < this.items.length; i++) {
      if (this.items[i].role == role) {
        return i;
      }
    }
    this.items.push({ role: role, list: [], isChecked: false })
    return i;
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
          this.users.push(role)
        } else {
          let list = [];
          for (var user of role.list) {
            if (user.val.name.toLowerCase().indexOf(val.toLowerCase()) > -1) {
              if (this.currentUser.uid != user.val.uid) {
                list.push(user);
              }
            }
          }
          this.users.push({ role: role.role, list: list, isChecked: role.isChecked })
        }
      }
      this.isCheckAll = false;
    } else {
      this.users = this.items;
      this.isCheckAll = true;
    }
  }

  check(pos, key, value) {
    if (value == false) {
      this.items[pos].isChecked = false;
    }
    for (var i = 0; i < this.items[pos].list.length; i++) {
      if (this.items[pos].list[i].key == key) {
        this.items[pos].list[i].isChecked = value;
        break;
      }
    }
  }

  checkAll(pos, val) {
    for (var i = 0; i < this.items[pos].list.length; i++) {
      console.log(this.isIn(this.users, this.items[pos].list[i]))
      if (!this.items[pos].list[i].isDisabled) {
        this.items[pos].list[i].isChecked = val;
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
