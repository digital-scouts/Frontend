import {Component, OnInit} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {HttpServiceService} from '../http-service.service';
import {ModalController} from '@ionic/angular';
import {HelperService} from '../helper.service';
import {ModalEditEventComponent} from '../modal-event-edit/modal-edit-event.component';
import {ModalEventDetailsComponent} from '../modal-event-details/modal-event-details.component';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.page.html',
    styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

    constructor(
        private storage: Storage,
        private router: Router,
        private http: HttpServiceService,
        private modal: ModalController,
    ) {
        // set default filter dates
        const today: Date = new Date();
        const d1: Date = new Date();
        const d2: Date = new Date();
        const d3: Date = new Date();
        const d4: Date = new Date(today.getFullYear(), today.getMonth(), 31);
        d1.setDate(today.getDate() - 365);
        d2.setDate(today.getDate() + 365);
        d4.setDate(today.getDate() + 185);
        this.filterDateMin = d1.toISOString();
        this.filterDateMax = d2.toISOString();
        this.filterStartDate = d3.toISOString();
        this.filterEndDate = d4.toISOString();

        // check permission
        this.storage.get('role').then(role => {
            this.hasPermissionToAddEvents = (role === 'admin' || role === 'leader');
        });
    }

    // warning when this will be updated, than update also the modal-event-details.component and modal-event-edit.component
    public events: Array<Array<{
        title: string,
        description: string,
        date: { isSameDay: boolean, isFullDay: boolean, startTime: string, endTime: string, formattedDate: string, weekDay:string },
        dateStart: Date,
        dateEnd: Date,
        groups: string[], // id`s
        competent: string[], // id´s
        public: boolean,
        id: string, // id
        creator: string, // id
    }>> = [];
    hasPermissionToAddEvents = false;
    filterEndDate: string;
    filterStartDate: string;

    filterDateMin: string;
    filterDateMax: string;

    ionViewWillEnter() {
        // goToLogin when not logged in
        this.http.getAndSetUserData().then(res => !res ? this.router.navigate(['/login']) : null);
    }

    ngOnInit() {
        this.applyFilter();
    }

    private drawCalendar(events) {
        this.events = [];

        // tslint:disable-next-line:forin
        for (const x in Object.keys(events)) {
            const key = Object.keys(events)[x];
            this.events.push([]);
            for (let i = 0; i < events[key].length; i++) {
                this.events[x].push({
                    title: events[key][i].eventName,
                    description: events[key][i].description,
                    date: HelperService.formatDateToTimespanString(new Date(events[key][i].dateStart), new Date(events[key][i].dateEnd)),
                    dateStart: new Date(events[key][i].dateStart),
                    dateEnd: new Date(events[key][i].dateEnd),
                    groups: events[key][i].groups,
                    competent: events[key][i].competent,
                    public: events[key][i].public,
                    id: events[key][i]._id,
                    creator: events[key][i].creator
                });
            }
        }
        console.log(this.events);
    }

    /**
     *open a modal to edit or create a event
     * @param id
     */
    async openAddEventModal(id: string) {
        if (this.hasPermissionToAddEvents) {
            for (let i = 0; id == null || i < this.events.length; i++) {
                for (let j = 0; id == null || j < this.events[i].length; j++) {
                    if (id == null || this.events[i][j].id === id) {
                        const myModal = await this.modal.create({
                            component: ModalEditEventComponent,
                            componentProps: {'event': (id === null) ? null : this.events[i][j]}
                        });
                        myModal.present();

                        // wait for modal and load data again
                        await myModal.onDidDismiss();
                        this.applyFilter();
                        return;
                    }
                }
            }
        } else {
            alert('missing Permission');
        }
    }

    /**
     * reload the event list with the new filter parameter
     */
    applyFilter() {
        let startDate: Date = new Date(this.filterStartDate);
        let endDate: Date = new Date(this.filterEndDate);

        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        endDate = new Date(endDate.getFullYear(), endDate.getMonth(), 31);

        this.http.getEvents(startDate.toISOString(), endDate.toISOString()).then(events => {
            this.drawCalendar(events);
        });
    }

    async showEvent_click(id: string) {
        console.log('detail event clicked for id: ' + id);
        for (let i = 0; i < this.events.length; i++) {
            for (let j = 0; j < this.events[i].length; j++) {
                if (this.events[i][j].id === id) {
                    const myModal = await this.modal.create({
                        component: ModalEventDetailsComponent,
                        componentProps: {'event': this.events[i][j]}
                    });

                    myModal.present();
                    const {data} = await myModal.onDidDismiss();
                    if (data.edit) {
                        this.openAddEventModal(id);
                    }
                    return;
                }
            }
        }
    }
}
