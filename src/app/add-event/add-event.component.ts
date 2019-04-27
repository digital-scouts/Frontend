import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {HttpServiceService} from '../http-service.service';

@Component({
    selector: 'app-add-event',
    templateUrl: './add-event.component.html',
    styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {
    eventTitle: string;
    eventIsPublic: boolean;
    eventStartDate: Date;
    eventEndDate: Date;
    eventDescription: string;

    constructor(
        private modal: ModalController,
        private http: HttpServiceService
    ) {
    }

    ngOnInit() {

    }

    closeModal() {
        this.modal.dismiss();
    }

    addEvent() {
        this.http.postEvent(this.eventTitle, this.eventIsPublic, this.eventStartDate, this.eventEndDate, this.eventDescription)
            .then(res => {
            console.log(res);
        });
    }
}
