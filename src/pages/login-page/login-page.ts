import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { RegisterPage } from '../register/register';
import firebase from 'firebase';
/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'reset-password-page',
  template: `

  <ion-header>

    <ion-navbar color="primary">
      <ion-title padding>Forgot Password</ion-title>
      <ion-buttons end padding-right>
        <button ion-button icon-only (click)="close()">
          <ion-icon name="close"></ion-icon>
        </button>
      </ion-buttons>
    </ion-navbar>

  </ion-header>


  <ion-content class="no-scroll">

    <div style="margin-top: 90px;margin-right: 16px;">
      <p padding text-center>Please enter your email to recover your password.</p>
      <ion-item>
        <ion-label color="primary">
          <ion-icon name="mail"></ion-icon>
        </ion-label>
        <ion-input #email type="email" placeholder="Email"></ion-input>
      </ion-item>


      <div style="padding-top: 60px; padding-left: 16px;" text-center>

        <button ion-button block large (click)="recover(email.value)">Recover Password</button>

      </div>
    </div>
  <ion-content>

  `
})
export class ResetPasswordPage {

  constructor(public viewCtrl: ViewController, public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public navParams: NavParams) {
  }

  recover(email) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
    });
    loading.present();
    firebase.auth().sendPasswordResetEmail(email).then(res => {
      loading.dismiss();
      this.viewCtrl.dismiss({ message: 'Check your email inbox to reset your password' })
    }).catch(err => {
      this.toastCtrl.create({
        message: err.message,
        duration: 3000,
      }).present();
      loading.dismiss();
    })
  }


  close() {
    this.viewCtrl.dismiss();
  }

}
@Component({
  selector: 'page-login-page',
  templateUrl: 'login-page.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public af: AngularFire) {

  }

  register() {
    let modal = this.modalCtrl.create(RegisterPage);
    modal.present();
  }

  login(email, pass) {

    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
    });
    loading.present();

    this.af.auth.login({ email: email, password: pass }, {
      provider: AuthProviders.Password,
      method: AuthMethods.Password,
    }).then(res => {
      //console.log(JSON.stringify(res));
      //this.navCtrl.setRoot(HomePage);
      loading.dismiss();
    }).catch(err => {
      //console.log(JSON.stringify(err));
      let toast = this.toastCtrl.create({
        message: err.message,
        duration: 3000,
      });
      loading.dismiss();
      toast.present();
    });
  }

  recover() {

    let modal = this.modalCtrl.create(ResetPasswordPage);
    modal.onDidDismiss(data => {
      if (data && data.message) {
        let toast = this.toastCtrl.create({
          message: data.message,
          duration: 3000,
        });
        toast.present();
      }
    });
    modal.present();

  }

}
