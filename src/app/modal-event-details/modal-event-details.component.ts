import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ModalEditEventComponent} from '../modal-event-edit/modal-edit-event.component';


@Component({
    selector: 'app-modal-event-details',
    templateUrl: './modal-event-details.component.html',
    styleUrls: ['./modal-event-details.component.scss']
})
export class ModalEventDetailsComponent implements OnInit {

    @Input() event: {
        title: string,
        description: string,
        date: { isSameDay: boolean, isFullDay: boolean, startTime: string, endTime: string, formattedDate: string, weekDay: string },
        dateStart: Date,
        dateEnd: Date,
        groups: string[], // id`s
        competent: string[], // id´s
        public: boolean,
        id: string, // id
        creator: string, // id
    };

    constructor(
        private modal: ModalController,
    ) {
    }

    ngOnInit() {

    }

    /**
     *
     * @param edit
     */
    closeModal(edit: boolean = false) {
        this.modal.dismiss({
            'edit': edit
        });
    }
}
