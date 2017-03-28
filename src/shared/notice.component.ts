import { Component, OnInit, Input } from '@angular/core';

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

    <ion-card>
            <ion-card-header>
                Files
            </ion-card-header>
            <ion-card-content>
                No files attached
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
})
export class NoticeComponent implements OnInit {

    @Input() notice: any;
    
    constructor() { }

    ngOnInit() { }
}