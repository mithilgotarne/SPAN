import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Notif provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Notif {

  constructor(public http: Http) {
    console.log('Hello Notif Provider');
  }

  send(role, notice) {
    return this.http.post('https://fast-gorge-72470.herokuapp.com/api', {
      role: role,
      payload: {
        notification: {
          title: notice.title,
          body: notice.desc
        }
      }
    }).map( res => res.json());
  }

}
