import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
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

  addNotice(notice){
    
  }

  /*send(role, notice) {
    return this.http.post('https://fast-gorge-72470.herokuapp.com/api', {
      role: role,
      payload: {
        notification: {
          title: notice.title,
          body: notice.desc
        }
      }
    }).map( res => res.json());
  }*/

}
