import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import firebase from 'firebase';

/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  user: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, 
  public loadingCtrl: LoadingController, private alertCtrl: AlertController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
    let user = firebase.auth().currentUser;
    if (user) {
      firebase.database().ref('/users/' + user.uid).on('value', snapshot => {
        this.user = snapshot.val();
      });
    }
    //console.log(this.user);
  }

  updateRole() {
    console.log(this.user.role);
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    firebase.database().ref('/users/' + this.user.uid).update({
      role: this.user.role
    }).then(() => loader.dismiss()).catch(err => loader.dismiss());
  }

  editDisplayName() {
    let alert = this.alertCtrl.create({
      title: 'Edit Display Name',
      inputs: [
        {
          name: 'displayName',
          placeholder: 'Display Name',
          value: this.user.name ? this.user.name : '',
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked ' + JSON.stringify(data));
            if (data.displayName && data.displayName.trim() !== '' && data.displayName.trim() !== ' ') {
              let loader = this.loadingCtrl.create({
                content: "Please wait..."
              });
              loader.present();
              firebase.database().ref('/users/' + this.user.uid).update({
                name: data.displayName
              }).then(() => loader.dismiss()).catch(err => loader.dismiss());
            }
          }
        }
      ]
    });
    alert.present();
  }



}
