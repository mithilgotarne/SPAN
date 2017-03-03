import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the NoticeDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-notice-details',
  templateUrl: 'notice-details.html'
})
export class NoticeDetailsPage {

  notice: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticeDetailsPage');
    this.notice = this.navParams.get('notice');
  }

}
