import { Component } from '@angular/core';
import { ViewController, NavParams, ToastController } from 'ionic-angular';
import firebase from 'firebase';

/*
  Generated class for the Register page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  role = "Student";

  constructor(public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public navParams: NavParams) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  register(name, email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
      let user = firebase.auth().currentUser;
      if (user) {
        var updates = {};
        var u = {
          name: name,
          uid: user.uid,
          role: this.role
        };
        updates['/users/' + user.uid] = u;
        firebase.database().ref('/allowedRoles/' + this.role).once('value').then(snapshot => {
          snapshot.forEach(role => {
            if (role.val())
              updates['/rolesUsers/' + role.key + '/' + this.role + '/' + user.uid] = u;
          });
          firebase.database().ref().update(updates);
        })

      }
      this.close();
    }).catch(err => {
      console.log(err);
      this.presentToast(err.message);
    });
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
