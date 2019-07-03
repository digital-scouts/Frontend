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

    monthList = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'July', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    weeksList = ['S', 'M', 'D', 'M', 'D', 'F', 'S'];

    datePickerStartObj = {
        fromDate: moment().subtract(3, 'm'),
        closeOnSelect: true, // default false
        mondayFirst: true, // default false
        todayLabel: 'Heute', // default 'Today'
        closeLabel: 'Abbrechen', // default 'Close'
        titleLabel: 'Anfang auswählen', // default null
        monthsList: this.monthList,
        weeksList: this.weeksList,
        dateFormat: 'DD.MM.YYYY', // default DD MMM YYYY
        clearButton: false, // default true
        momentLocale: 'de-DE', // Default 'en-US'
    };

    datePickerEndObj = {
        fromDate: this.eventStartDate, // default null
        showTodayButton: false,
        closeOnSelect: true, // default false
        mondayFirst: true, // default false
        closeLabel: 'Abbrechen', // default 'Close'
        titleLabel: 'Ende auswählen', // default null
        monthsList: this.monthList,
        weeksList: this.weeksList,
        dateFormat: 'DD.MM.YYYY', // default DD MMM YYYY
        clearButton: false, // default true
        momentLocale: 'de-DE', // Default 'en-US'
    };

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
        const startDate = new Date(this.eventStartDate);
        const endDate = new Date(this.eventEndDate);
        if (this.fullDayEvent) {
            startDate.setHours(0);
            startDate.setMinutes(0);
            endDate.setHours(0);
            endDate.setMinutes(0);
        }
        if (this.event == null) {
            this.http.postEvent(this.eventTitle, this.eventPublic, startDate, endDate, this.eventDescription, this.eventGroups)
                .then(res => {
                    console.log(res);
                    this.showEventSuccessToast();
                    this.closeModal();
                }, (err) => {
                    console.log(err);
                    this.showEventErrorToast();
                });
        } else {
            this.http.putEvent(this.event.id, this.eventTitle, this.eventPublic, startDate, endDate, this.eventDescription)
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
        const selected_day = HelperService.gerDateToISO(date);

        if (isStart) {
            // end can´t be picket earlier than start
            this.datePickerEndObj.fromDate = selected_day;

            if (moment(selected_day).isAfter(HelperService.gerDateToISO(this.eventEndDate), 'day')) {// end is after start
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
        let timeObj = moment(HelperService.gerDateToISO(isStart ? this.eventStartDate : this.eventEndDate));
        timeObj = timeObj.hour(parseInt(time.split(':')[0], 10))
            .minute(parseInt(time.split(':')[1], 10));

        const secondTime = !isStart ? this.eventStartTime : this.eventEndTime;
        let secondTimeObj = moment(HelperService.gerDateToISO(!isStart ? this.eventStartDate : this.eventEndDate));
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
