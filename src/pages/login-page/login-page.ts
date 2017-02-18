import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login-page',
  templateUrl: 'login-page.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public af: AngularFire) {

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

}
