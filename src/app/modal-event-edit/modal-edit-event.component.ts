import {Component, Input, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {HttpServiceService} from '../http-service.service';
import {HelperService} from '../helper.service';
import * as moment from 'moment';

@Component({
    selector: 'app-modal-edit-event',
    templateUrl: './modal-edit-event.component.html',
    styleUrls: ['./modal-edit-event.component.scss']
})
export class ModalEditEventComponent implements OnInit {

    constructor(
        private modal: ModalController,
        private http: HttpServiceService,
        public toastController: ToastController,
        private helper: HelperService,
    ) {
    }

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

    fullDayEvent: boolean;
    eventTitle: string;
    eventDescription: string;
    eventPublic = false;
    eventGroups: string[];

    allGroups = this.helper.getAllGroups();

    eventStartDate: string;
    eventEndDate: string;

    eventStartTime: string;
    eventEndTime: string;

    datePickerStartObj = Object.assign({
        fromDate: moment().subtract(3, 'm'),
        titleLabel: 'Anfang auswählen', // default null
    }, this.helper.datePickerObj);

    datePickerEndObj = Object.assign({
        fromDate: this.eventStartDate, // default null
        showTodayButton: false,
        titleLabel: 'Ende auswählen', // default null
    }, this.helper.datePickerObj);

    ngOnInit(): void {
        if (this.event != null) {
            this.eventStartDate = this.eventStartTime = this.event.dateStart.toISOString();
            this.eventEndDate = this.eventEndTime = this.event.dateEnd.toISOString();

            this.eventPublic = this.event.public;
            this.eventDescription = this.event.description;
            this.eventTitle = this.event.title;
        } else {
            this.eventStartDate = this.eventEndDate = moment().format('DD.MM.YYYY');
            this.eventStartTime = this.eventEndTime = moment().add(1, 'h').minutes(0).format('HH:mm');
        }
    }

    closeModal() {
        this.modal.dismiss();
    }

    async showEventSuccessToast() {
        const toast = await this.toastController.create({
            message: 'Your settings have been saved.',
            duration: 2000
        });
        toast.present();
    }

    async showEventErrorToast() {
        const toast = await this.toastController.create({
            message: 'Something went wrong.',
            duration: 2000
        });
        toast.present();
    }

    addEvent() {

        const startDate = moment(this.eventStartDate, 'DD.MM.YYYY');
        const endDate = moment(this.eventEndDate, 'DD.MM.YYYY');
        if (this.fullDayEvent) {
            startDate.hours(0).minutes(0);
            endDate.hours(0).minutes(0);
        } else {
            startDate.hour(Number(this.eventStartTime.split(':')[0])).minute(Number(this.eventStartTime.split(':')[1]));
            endDate.hour(Number(this.eventEndTime.split(':')[0])).minute(Number(this.eventEndTime.split(':')[1]));
        }

        // fix timezone
        startDate.add(startDate.utcOffset(), 'm');
        endDate.add(endDate.utcOffset(), 'm');

        if (this.event == null) {
            this.http.postEvent(this.eventTitle, this.eventPublic, startDate.format(), endDate.format(), this.eventDescription, this.eventGroups)
                .then(res => {
                    console.log(res);
                    this.showEventSuccessToast();
                    this.closeModal();
                }, (err) => {
                    console.log(err);
                    this.showEventErrorToast();
                });
        } else {
            this.http.putEvent(this.event.id, this.eventTitle, this.eventPublic, startDate.toDate(), endDate.toDate(), this.eventDescription)
                .then(res => {
                    console.log(res);
                    this.showEventSuccessToast();
                    this.closeModal();
                }, (err) => {
                    console.log(err);
                    this.showEventErrorToast();
                });
        }
    }

    deleteEvent() {
        this.http.deleteEvent(this.event.id).then((res) => {
            console.log(res);
            this.showEventSuccessToast();
            this.closeModal();
        }, (err) => {
            console.log(err);
            this.showEventErrorToast();
        });
    }

    /**
     * end can´t be picket earlier than start
     * change this.datePickerEndObj.fromDate to date
     * change this.eventEndDate to date when start > end
     * @param isStart
     * @param date
     */
    dateChanged(isStart: boolean, date: string) {
        const selected_day = HelperService.getDateToISO(date);

        if (isStart) {
            // end can´t be picket earlier than start
            this.datePickerEndObj.fromDate = selected_day;

            if (moment(selected_day).isAfter(HelperService.getDateToISO(this.eventEndDate), 'day')) {// end is after start
                this.eventEndDate = moment(selected_day).format('DD.MM.YYYY');
            }
        }
    }

    /**
     * end can´t be picket earlier than start
     * @param isStart
     * @param time
     */
    timeChanged(isStart: boolean, time: string) {
        let timeObj = moment(HelperService.getDateToISO(isStart ? this.eventStartDate : this.eventEndDate));
        timeObj = timeObj.hour(parseInt(time.split(':')[0], 10))
            .minute(parseInt(time.split(':')[1], 10));

        const secondTime = !isStart ? this.eventStartTime : this.eventEndTime;
        let secondTimeObj = moment(HelperService.getDateToISO(!isStart ? this.eventStartDate : this.eventEndDate));
        secondTimeObj = secondTimeObj.hour(parseInt(secondTime.split(':')[0], 10))
            .minute(parseInt(secondTime.split(':')[1], 10));

        // set start or ent event when end will be earlier than start
        if (this.eventStartDate === this.eventEndDate) {
            if (isStart && moment(timeObj).isAfter(secondTimeObj, 'minute')) {
                this.eventEndTime = timeObj.format('HH:mm');
            } else if (moment(secondTimeObj).isAfter(timeObj, 'minute')) {
                this.eventStartTime = timeObj.format('HH:mm');
            }
        }
    }
}
