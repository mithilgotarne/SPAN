import { Component } from '@angular/core';

import { Splashscreen } from 'ionic-native';

import { NavController, ModalController } from 'ionic-angular';

import { AddNoticePage } from '../add-notice/add-notice';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items = [];
  constructor(public navCtrl: NavController, private modalCtrl: ModalController) {
    Splashscreen.hide();
  }

  ionViewWillEnter() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (localStorage.getItem('items') == null) {
      localStorage.setItem('items', '[]');
    }
    this.items = JSON.parse(localStorage.getItem('items'));
  }

  addNewNotice() {
    let addModal = this.modalCtrl.create(AddNoticePage);
    addModal.onDidDismiss(data => {
      if (data)
        this.items = data.items;
    });
    addModal.present();
  }

}
