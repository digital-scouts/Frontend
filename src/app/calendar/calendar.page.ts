import {Component, OnInit} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {HttpServiceService} from '../http-service.service';
import {ModalController} from '@ionic/angular';
import {HelperService} from '../helper.service';
import {ModalEditEventComponent} from '../modal-event-edit/modal-edit-event.component';
import {PopoverEventDetailsComponent} from '../popover-event-details/popover-event-details.component';
import {PopoverEventsFilterComponent} from '../popover-events-filter/popover-events-filter.component';
import {PopoverController} from '@ionic/angular';
import * as moment from 'moment';

moment.locale('de');

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.page.html',
    styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

    constructor(
        private popoverCtrl: PopoverController,
        private storage: Storage,
        private router: Router,
        private http: HttpServiceService,
        private modal: ModalController,
        private helper: HelperService
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

        this.storage.get('role').then(role => {
            // check permission
            this.hasPermissionToAddEvents = (role === 'admin' || role === 'leader');

            this.storage.get('group').then(group => {
                this.filteredGroups = (role === 'admin' || role === 'leader') ? this.allGroups.map(a => a.id) : [group];
            });
        });
    }

    // warning when this will be updated, than update also the popover-event-details.component and modal-event-edit.component
    public events: Array<Array<Array<{
        title: string,
        description: string,
        date: { isSameDay: boolean, isFullDay: boolean, startTime: string, endTime: string, formattedStartDate: string, formattedEndDate: string, formattedTimeSpan: string, weekDay: string, month: string },
        dateStart: Date,
        dateEnd: Date,
        groups: string[], // colors
        competent: string[], // id´s
        public: boolean,
        id: string, // id
        creator: string, // id
    }>>> = [];

    allGroups = this.helper.getAllGroups();
    filteredGroups: string[];

    filterSelectedTypes = {event: true, lesson: true, task: true};

    hasPermissionToAddEvents = false;

    filterEndDate: string;
    filterStartDate: string;

    filterDateMin: string;
    filterDateMax: string;

    ngOnInit() {
        this.applyFilter();
    }

    /**
     * add events, lessons and tasks to this.events array
     * @param events
     */
    private async drawCalendar(events) {
        // console.log('_______________________-- drawCalendar --_______________________');
        this.events = [];
        if (events) {
            let month = '0';
            let monthIdx = -1;
            let dayInMonthIdx = 0;
            // tslint:disable-next-line:forin
            for (const x in Object.keys(events)) {
                // console.log('next key: ' + x);
                const key = Object.keys(events)[x];
                if (month === '0' || key.split('-')[1] !== month) {
                    this.events.push([]);
                    month = key.split('-')[1];
                    monthIdx++;
                    dayInMonthIdx = -1;
                }
                dayInMonthIdx++;
                this.events[monthIdx].push([]);
                // console.log('new month: ' + monthIdx);
                for (let i = 0; i < events[key].length; i++) {
                    const rawStartDate = new Date(events[key][i].dateStart);
                    rawStartDate.setTime(rawStartDate.getTime() + rawStartDate.getTimezoneOffset() * 60 * 1000);
                    const rawEndDate = new Date(events[key][i].dateEnd);
                    rawEndDate.setTime(rawEndDate.getTime() + rawEndDate.getTimezoneOffset() * 60 * 1000);
                    // console.log('push event: ' + events[key][i].eventName);
                    this.events[monthIdx][dayInMonthIdx].push({
                        title: events[key][i].eventName,
                        description: events[key][i].description,
                        date: HelperService.formatDateToTimespanString(rawStartDate, rawEndDate),
                        dateStart: rawStartDate,
                        dateEnd: rawEndDate,
                        groups: HelperService.getColorArrayFromGroupArray(events[key][i].groups),
                        competent: events[key][i].competent,
                        public: events[key][i].public,
                        id: events[key][i]._id,
                        creator: events[key][i].creator
                    });
                }
            }
        }
        // console.log('_______________________-- drawCalendar end --_______________________');
    }

    /**
     * reload the event list with the new filter parameter
     */
    async applyFilter() {
        let startDate: Date = new Date(this.filterStartDate);
        let endDate: Date = new Date(this.filterEndDate);

        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        endDate = new Date(endDate.getFullYear(), endDate.getMonth(), 31);

        const filterTypes = [];
        if (this.filterSelectedTypes.event) {
            filterTypes.push('event');
        }
        if (this.filterSelectedTypes.lesson) {
            filterTypes.push('lesson');
        }

        if (this.filterSelectedTypes.event || this.filterSelectedTypes.lesson) {
            this.http.getEvents(startDate.toISOString(), endDate.toISOString(), this.filteredGroups, filterTypes).then(e => {
                console.log(e);
                this.drawCalendar(e);
            });
        }
    }

    /**
     * open a modal to edit or create a event
     * @param id
     */
    async openAddEventModal(id: string) {
        if (this.hasPermissionToAddEvents) {
            for (let i = 0; id == null || i < this.events.length; i++) {
                for (let k = 0; id == null || k < this.events[i].length; k++) {
                    for (let j = 0; id == null || j < this.events[i][k].length; j++) {
                        if (id == null || this.events[i][k][j].id === id) {
                            const myModal = await this.modal.create({
                                component: ModalEditEventComponent,
                                componentProps: {'event': (id === null) ? null : this.events[i][k][j]}
                            });
                            myModal.present();

                            // wait for modal and load data again
                            await myModal.onDidDismiss();
                            this.applyFilter();
                            return;
                        }
                    }
                }
            }
        } else {
            alert('missing Permission');
        }
    }

    /**
     * onclick event to show a specific event in modal
     * @param id
     */
    async showEvent_click(id: string) {
        event.stopPropagation();
        for (let i = 0; i < this.events.length; i++) {
            for (let k = 0; k < this.events[i].length; k++) {
                for (let j = 0; j < this.events[i][k].length; j++) {
                    if (this.events[i][k][j].id === id) {
                        this.presentEventDetailsPopover(event, this.events[i][k][j]);
                    }
                }
            }
        }
    }

    /**
     * present the popover filter and filter the events on dismiss
     * @param e
     */
    async presentPopover(e) {
        const popover = await this.popoverCtrl.create({
            component: PopoverEventsFilterComponent,
            event: e,
            componentProps: {
                filterDateMin: this.filterDateMin,
                filterDateMax: this.filterDateMax,
                filterStartDate: this.filterStartDate,
                filterEndDate: this.filterEndDate,
                filterSelectedGroups: this.filteredGroups,
                filterSelectedTypes: this.filterSelectedTypes
            }
        });

        popover.onDidDismiss()
            .then((result) => {
                if (result['data'] !== undefined) {
                    console.log(result['data']);
                    this.filterStartDate = result['data']['filterStartDate'];
                    this.filterEndDate = result['data']['filterEndDate'];
                    this.filteredGroups = result['data']['groups'];
                    this.filterSelectedTypes = result['data']['types'];
                    this.applyFilter();
                }
            });

        return await popover.present();
    }

    /**
     *
     * @param e
     * @param event
     */
    async presentEventDetailsPopover(e, event) {
        const popover = await this.popoverCtrl.create({
            component: PopoverEventDetailsComponent,
            event: e,
            componentProps: {
                event: event
            }
        });

        popover.onDidDismiss()
            .then((result) => {
                if (result['data'] !== undefined && result['data']['edit']) {
                    console.log(result['data']);
                    this.openAddEventModal(event['id']);
                }
            });

        return await popover.present();
    }
}
