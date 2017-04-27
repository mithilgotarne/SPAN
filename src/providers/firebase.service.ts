import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import firebase from 'firebase';

/*
  Generated class for the FirebaseService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class FirebaseService {
  user: any;
  constructor(public http: Http) {
    //console.log('Fir Provider');
    let user = firebase.auth().currentUser;
    if (user) {
      firebase.database().ref('/users/' + user.uid).once('value').then(res => {
        this.user = res.val();
      })
    }
  }

  updateUserProperty(property, value) {
    var updates = {};
    updates['/users/' + this.user.uid + '/' + property] = value;
    return Promise.resolve(firebase.database().ref('/allowedRoles/' + this.user.role).once('value').then(snapshot => {
      snapshot.forEach(role => {
        if (role.val())
          updates['/rolesUsers/' + role.key + '/' + this.user.role + '/' + this.user.uid + '/' + property] = value;
      });
      return firebase.database().ref().update(updates);
    }))
  }

  addNotice(notice, selectedUsers) {
    var updates = {};
    var userNotice = {
      title: notice.title,
      createdTime: notice.createdTime,
      createdBy: {
        name: notice.createdBy.name,
        uid: notice.createdBy.uid
      }
    }
    var pushKey = firebase.database().ref('/notices').push().key;
    updates['/userNotices/' + this.user.uid + '/' + pushKey] = userNotice;
    updates['/notices/' + pushKey] = notice;
    updates['/sharedWith/' + pushKey + '/' + this.user.uid] = true;
    for (let user of selectedUsers) {
      updates['/userNotices/' + user.uid + '/' + pushKey] = userNotice;
      updates['/sharedWith/' + pushKey + '/' + user.uid] = true;
    }
    return Promise.resolve(firebase.database().ref().update(updates).then(()=> {
      if (selectedUsers && selectedUsers.length > 0)
        return this.send(notice, selectedUsers);
      else 
        return Promise.resolve({ status: "success" }) 
    }))
  }

  shareNotice(notice, selectedUsers) {
    var updates = {};
    var userNotice = {
      title: notice.notice.title,
      createdTime: notice.notice.createdTime,
      createdBy: {
        name: notice.notice.createdBy.name,
        uid: notice.notice.createdBy.uid
      }
    }
    for (let user of selectedUsers) {
      updates['/userNotices/' + user.uid + '/' + notice.key] = userNotice;
      updates['/sharedWith/' + notice.key + '/' + user.uid] = true;
    }
    return Promise.resolve(firebase.database().ref().update(updates).then(()=> {
      return this.send(notice.notice, selectedUsers);
    }))
  }

  deleteNotice(notice) {
    return Promise.resolve(firebase.database().ref('/sharedWith/' + notice.key).once('value').then(snapshots => {
      var updates = {};
      updates['/notices/' + notice.key] = notice;
      snapshots.forEach(snapshot => {
        updates['/userNotices/' + snapshot.key + '/' + notice.key] = null;
        updates['/sharedWith/' + notice.key + '/' + snapshot.key] = null;
      });
      return firebase.database().ref().update(updates);
    }))
  }

  private send(notice, selectedUsers) {
    return this.http.post('https://fast-gorge-72470.herokuapp.com/api', {
      notice: notice,
      users: selectedUsers
    }).toPromise()
    .then(res => res.json())
  }

}
