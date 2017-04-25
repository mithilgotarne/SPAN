import { Component, OnChanges, Input } from '@angular/core';
import { Platform } from 'ionic-angular';

@Component({
    selector: 'notice',
    template: `
    <ion-card>
        <ion-card-header>
            Title
        </ion-card-header>
        <ion-card-content>
            {{ notice?.notice.title }}
        </ion-card-content>
    </ion-card>


    <ion-card>
        <ion-card-header>
            Description
        </ion-card-header>
        <ion-card-content>
            {{ notice?.notice.desc }}
        </ion-card-content>
    </ion-card>

    <ion-card *ngIf="files.length > 0">
            <ion-card-header>
                Files
            </ion-card-header>
            <ion-card-content>
                <ion-slides [pager]="true" [zoom]="true" [slidesPerView]="slidesPerView">
                    <ion-slide *ngFor="let file of files">
                        <img *ngIf="isImage(file.type)" src="{{ file.url }}">
                        <img *ngIf="!isImage(file.type)" src="assets/icon/docs.png">
                        <div class="floating-slider-text"><span>{{ file.name }}</span></div>
                        <div class="floating-slider-icon">
                            <a target="_blank" href="{{ file.url }}"><ion-icon name="download"></ion-icon></a>
                        </div>
                    </ion-slide>
                </ion-slides>
            </ion-card-content>
    </ion-card>

    <ion-card>
            <ion-card-header>
                Created on
            </ion-card-header>
            <ion-card-content>
                {{ notice?.notice.createdTime | date:'hh:mm a dd MMM, y'}}
            </ion-card-content>
    </ion-card>
    `,
    styles: [`
    .slide-zoom{
        position: relative;
    }
    .floating-slider-text, .floating-slider-icon{
        position: absolute;
    }
    .floating-slider-text{
        width: 100%;
        bottom: 8%;
        color: white;
    }
    .floating-slider-icon{
        top: 0%;
        right: 5%;
        color: white;
        background: rgba(0,0,0,0.4);
        padding: 4px 12px;
        border-radius: 8px;
        cursor: pointer;
    }
    .floating-slider-text span{
        background: rgba(0,0,0,0.5);
        padding: 5px 5px;
        border-radius: 10px;
        font-size: 9px;
    }
    .swiper-slide img {
        height: 134px;
    }
    `]
})
export class NoticeComponent implements OnChanges {

    @Input() notice: any;
    files = [];
    slidesPerView = 4;

    constructor(private platform: Platform) {

        if(this.platform.is('android')){
            this.slidesPerView = 2;
        }

    }

    ngOnChanges() {
        console.log(this.notice);
        this.files = []
        if (this.notice && this.notice.notice && this.notice.notice.files) {
            for (let key in this.notice.notice.files) {
                this.files.push(this.notice.notice.files[key])
            }
        }
        console.log(this.files);
    }

    isImage(type: string) {
        return type.indexOf("image") > -1;
    }

}