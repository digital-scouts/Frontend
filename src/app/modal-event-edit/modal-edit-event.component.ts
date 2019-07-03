import {Component, Input, OnInit} from '@angular/core';
import {ModalController, PopoverController, ToastController} from '@ionic/angular';
import {HttpServiceService} from '../http-service.service';
import {HelperService} from '../helper.service';
import {PopoverDatepickerComponent} from '../popover-datepicker/popover-datepicker.component';

@Component({
    selector: 'app-modal-edit-event',
    templateUrl: './modal-edit-event.component.html',
    styleUrls: ['./modal-edit-event.component.scss']
})
export class ModalEditEventComponent implements OnInit {

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
    eventStartDate: string;
    eventEndDate: string;
    eventTitle: string;
    eventDescription: string;
    eventPublic = false;
    eventGroups: string[];

    allGroups = this.helper.getAllGroups();

    constructor(
        private modal: ModalController,
        private http: HttpServiceService,
        public toastController: ToastController,
        private helper: HelperService,
        private popoverCtrl: PopoverController,
    ) {
    }

    ngOnInit(): void {


        if (this.event != null) {
            this.eventStartDate = this.event.dateStart.toISOString();
            this.eventEndDate = this.event.dateEnd.toISOString();

            this.eventPublic = this.event.public;
            this.eventDescription = this.event.description;
            this.eventTitle = this.event.title;
        } else {
            this.eventStartDate = this.eventEndDate = new Date(Date.now()).toISOString();
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

    async openSelectDatePopover(event) {
        const popover = await this.popoverCtrl.create({
            component: PopoverDatepickerComponent,
            event: event,
            componentProps: {}
        });

        popover.onDidDismiss()
            .then((result) => {
                if (result['data'] !== undefined) {
                    console.log(result['data']);
                }
            });

        return await popover.present();
    }
}
