import { Component } from '@angular/core';
import { ModalController, ViewController, NavParams, ToastController, Platform, LoadingController } from 'ionic-angular';
import firebase from 'firebase';
import { Diagnostic } from '@ionic-native/diagnostic';
import { FirebaseService } from '../../providers/firebase.service';
import { NoticeSharePage } from '../notice-share/notice-share';

/*
  Generated class for the AddNotice page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-notice',
  templateUrl: 'add-notice.html',
  providers: [FirebaseService, Diagnostic]
})
export class AddNoticePage {

  user: any;
  selectedUsers = [];
  sendText = "No users seleced";
  files = [];
  uploadTasks = [];
  canUpload = true;

  constructor(public viewCtrl: ViewController, private diagnostic: Diagnostic, private platform: Platform,
    public modalCtrl: ModalController, private toastCtrl: ToastController, private loadingCtrl: LoadingController,
    navParams: NavParams, private fs: FirebaseService) {
    this.user = navParams.get('user');
    this.checkAndroidPermissions();
  }

  closePage() {
    this.viewCtrl.dismiss();
  }

  tag() {
    let modal = this.modalCtrl.create(NoticeSharePage, { user: this.user, users: this.selectedUsers });
    modal.onDidDismiss(data => {
      if (data && data.users) {
        this.selectedUsers = data.users;
        if (this.selectedUsers.length > 0) {
          let str = "";
          if (this.selectedUsers.length == 1)
            str = this.selectedUsers[0].name;
          else if (this.selectedUsers.length == 2)
            str = this.selectedUsers[0].name + ", " + this.selectedUsers[1].name;
          else {
            str = this.selectedUsers[0].name + " and " + (this.selectedUsers.length - 1) + " others";
          }
          this.sendText = str;
        } else {
          this.sendText = "No users seleced";
        }
      }
    })
    modal.present();
  }

  create(title, desc) {
    let files = {};
    for (let file of this.files) {
      files[file.file.lastModified] = { name: file.file.name, url: file.url, path: file.path, type: file.file.type };
    }
    const notice = {
      title: title,
      desc: desc,
      createdTime: firebase.database.ServerValue.TIMESTAMP,
      createdBy: this.user,
      files: files
    }
    let loading = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loading.present();
    this.fs.addNotice(notice, this.selectedUsers).then(() => {
      loading.dismiss();
    }).catch(err => {
      loading.dismiss();
      let toast = this.toastCtrl.create({ message: err.message, duration: 3000 });
      toast.present();

    })
  }

  removeFile(index) {
    if (this.files[index].state != 'success') {
      this.uploadTasks[index].cancel();
      console.log("cancelled")
      this.files.splice(index, 1);
      this.uploadTasks.splice(index, 1);
    }
    else {
      firebase.storage().ref(this.files[index].path).delete().then(() => {
        this.uploadTasks.splice(index, 1);
      });
      this.files.splice(index, 1);
    }
  }

  addFiles($event) {
    for (let file of $event.srcElement.files) {
      this.files.push({ file: file, state: 'running', url: null });
      let uploadtask = firebase.storage().ref('files/' + this.user.uid + '/' + file.name).put(file);
      uploadtask.on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
        for (let i = 0; i < this.files.length; i++) {
          if (this.files[i].file.name == file.name) {
            this.files[i].state = snapshot.state;
          }
        }
      }, null, () => {
        for (let i = 0; i < this.files.length; i++) {
          if (this.files[i].file.name == file.name) {
            this.files[i].url = uploadtask.snapshot.downloadURL;
            this.files[i].path = 'files/' + this.user.uid + '/' + file.name;
            this.files[i].state = 'success';
          }
        }
      });
      this.uploadTasks.push(uploadtask);

    }
    console.log(this.files);
  }

  checkAndroidPermissions() {
    this.diagnostic.isExternalStorageAuthorized().then(authorised => {
      if (!authorised) {
        this.diagnostic.requestExternalStorageAuthorization().then(status => {
          if (status != this.diagnostic.permissionStatus.GRANTED
            || status != this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE) {
            let toast = this.toastCtrl.create({ message: "Sorry, You cannot upload files.", duration: 3000 });
            toast.present();
            this.canUpload = false;
          }
        }).catch(error => { console.log("request error " + error); this.canUpload = false; });
      }
    }).catch(error => { console.log(error); this.canUpload = false; })
  }
}