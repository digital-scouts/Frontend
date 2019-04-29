import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {HttpServiceService} from '../http-service.service';

@Component({
    selector: 'app-modal-edit-event',
    templateUrl: './modal-edit-event.component.html',
    styleUrls: ['./modal-edit-event.component.scss']
})
export class ModalEditEventComponent implements OnInit {

    // id of event to edit, if id null than create a new Event
    @Input() id: string;

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
