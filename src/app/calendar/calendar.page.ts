import {Component, OnInit} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {HttpServiceService} from '../http-service.service';
import {ModalController} from '@ionic/angular';
import {HelperService} from '../helper.service';
import {ModalEditEventComponent} from '../modal-event-edit/modal-edit-event.component';
import {ModalEventDetailsComponent} from '../modal-event-details/modal-event-details.component';
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

    // warning when this will be updated, than update also the modal-event-details.component and modal-event-edit.component
    public events: Array<Array<{
        title: string,
        description: string,
        date: { isSameDay: boolean, isFullDay: boolean, startTime: string, endTime: string, formattedStartDate: string, formattedEndDate: string, formattedTimeSpan: string, weekDay: string },
        dateStart: Date,
        dateEnd: Date,
        groups: string[], // colors
        competent: string[], // id´s
        public: boolean,
        id: string, // id
        creator: string, // id
    }>> = [];

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
     * @param tasks
     */
    private async drawCalendar(events, tasks) {
        this.events = [];
        console.log('events: ');
        console.log(events);
        if (events) {
            // tslint:disable-next-line:forin
            for (const x in Object.keys(events)) {
                const key = Object.keys(events)[x];
                this.events.push([]);
                for (let i = 0; i < events[key].length; i++) {
                    const rawStartDate = new Date(events[key][i].dateStart);
                    rawStartDate.setTime(rawStartDate.getTime() + rawStartDate.getTimezoneOffset() * 60 * 1000);
                    const rawEndDate = new Date(events[key][i].dateEnd);
                    rawEndDate.setTime(rawEndDate.getTime() + rawEndDate.getTimezoneOffset() * 60 * 1000);

                    this.events[x].push({
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
    }

    /**
     * reload the event list with the new filter parameter
     */
    async applyFilter() {
        let startDate: Date = new Date(this.filterStartDate);
        let endDate: Date = new Date(this.filterEndDate);

        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        endDate = new Date(endDate.getFullYear(), endDate.getMonth(), 31);

        let events = null;
        const task = null;

        const callStack = [];
        if (this.filterSelectedTypes.event) {
            callStack.push(this.http.getEvents(startDate.toISOString(), endDate.toISOString(), this.filteredGroups).then(e => events = e));
        }
        if (this.filterSelectedTypes.task) {
            // callStack.push(this.http.getTask().then(t => task = t));
        }
        await Promise.all(callStack);
        this.drawCalendar(events, task);
    }

    /**
     * open a modal to edit or create a event
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
     * onclick event to show a specific event in modal
     * @param id
     */
    async showEvent_click(id: string) {
        event.stopPropagation();
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

    /**
     * present the popover filter and filter the events on dismiss
     * @param event
     */
    async presentPopover(event) {
        const popover = await this.popoverCtrl.create({
            component: PopoverEventsFilterComponent,
            event: event,
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
}
