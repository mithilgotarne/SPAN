import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/*
  Generated class for the AddNotice page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-notice',
  templateUrl: 'add-notice.html'
})
export class AddNoticePage {

  constructor(public viewCtrl: ViewController) { }

  closePage(items?) {
    if(items)
      this.viewCtrl.dismiss({ items: items });
    else
      this.viewCtrl.dismiss();
  }

  create(title, desc) {
    var items = JSON.parse(localStorage.getItem('items'));
    items.push({ title: title, desc: desc, time: Date.now() });
    localStorage.setItem('items', JSON.stringify(items));
    this.closePage(items);
  }

}
