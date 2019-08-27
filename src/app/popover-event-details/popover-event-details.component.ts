import {Component} from '@angular/core';
import {NavParams, PopoverController} from '@ionic/angular';

import * as moment from 'moment';
moment.locale('de');

@Component({
    selector: 'app-modal-event-details',
    templateUrl: './popover-event-details.component.html',
    styleUrls: ['./popover-event-details.component.scss']
})
export class PopoverEventDetailsComponent {

    event: {
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

    formattedStart;
    formattedEnd;

    constructor(
        private popoverCtrl: PopoverController,
        public navParams: NavParams
    ) {
        this.event = this.navParams.get('event');
        this.formattedStart = moment(this.event.dateStart).format('llll');
        this.formattedEnd = moment(this.event.dateEnd).format('llll');

        console.log(this.event);
    }


    dismiss(edit: boolean = false) {
        this.popoverCtrl.dismiss({
            'edit': edit
        });
    }
}
