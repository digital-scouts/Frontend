import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {HttpServiceService} from '../http-service.service';

@Component({
    selector: 'app-modal-edit-event',
    templateUrl: './modal-edit-event.component.html',
    styleUrls: ['./modal-edit-event.component.scss']
})
export class ModalEditEventComponent implements OnInit {

    @Input() event: {
        title: string,
        description: string,
        displayDate: string,
        dateStart: Date,
        dateEnd: Date,
        groups: string[], // id`s
        competent: string[], // id´s
        public: boolean,
        id: string, // id
        creator: string, // id
    };

    eventTitle: string;
    eventIsPublic = true;
    eventStartDate: Date;
    eventEndDate: Date;
    eventDescription: string;

    constructor(
        private modal: ModalController,
        private http: HttpServiceService
    ) {
        console.log('constructor: ' + this.event);
    }

    ionViewDidEnter() {
        console.log('ionViewDidEnter: ' + this.event);
        if (this.event !== null) {
            this.eventTitle = this.event.title;
            this.eventDescription = this.event.description;
            this.eventEndDate = this.event.dateEnd;
            this.eventStartDate = this.event.dateStart;
            this.eventIsPublic = this.event.public;
        }

    }

    closeModal() {
        this.modal.dismiss();
    }

    addEvent() {
        if (this.event === null) {
            this.http.postEvent(this.eventTitle, this.eventIsPublic, this.eventStartDate, this.eventEndDate, this.eventDescription)
                .then(res => {
                    console.log(res);
                });
        } else {
            this.http.putEvent(this.event.id, this.eventTitle, this.eventIsPublic, this.eventStartDate,
                this.eventEndDate, this.eventDescription)
                .then(res => {
                    console.log(res);
                });
        }

    }

    ngOnInit(): void {
    }

}
