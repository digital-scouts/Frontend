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

            // preset filter group checkbox
            this.http.getGroups().then(groups => {
                // tslint:disable-next-line:forin
                // @ts-ignore
                for (let i = 0; i < groups.length; i++) {
                    this.allGroups.push({
                        id: groups[i]['_id'],
                        color: groups[i]['color'],
                        name: groups[i]['name'],
                        isChildGroup: groups[i]['childGroup'],
                        selected: (groups[i]['defaultForRole'] === role || (role === 'admin' || role === 'leader'))
                    });
                }
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

    // warning when this will be updated, than update also the popover-events-filter.component
    allGroups: Array<{
        id: string,
        color: string,
        name: string,
        isChildGroup: boolean,
        selected: boolean
    }> = [];

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
     * todo add lessons to events object
     * @param events
     * @param lessons
     * @param tasks
     */
    private async drawCalendar(events, lessons, tasks) {
        this.events = [];

        if (events) {
            // tslint:disable-next-line:forin
            for (const x in Object.keys(events)) {
                const key = Object.keys(events)[x];
                this.events.push([]);
                for (let i = 0; i < events[key].length; i++) {
                    // hint push to same index as events array
                    this.events[x].push({
                        title: events[key][i].eventName,
                        description: events[key][i].description,
                        date: HelperService.formatDateToTimespanString(new Date(events[key][i].dateStart), new Date(events[key][i].dateEnd)),
                        dateStart: new Date(events[key][i].dateStart),
                        dateEnd: new Date(events[key][i].dateEnd),
                        groups: HelperService.getColorArrayFromGroupArray(events[key][i].groups),
                        competent: events[key][i].competent,
                        public: events[key][i].public,
                        id: events[key][i]._id,
                        creator: events[key][i].creator
                    });
                }
            }
        }

        console.log('lessons: ');
        console.log(lessons);
        if (lessons) {
            const allLessons: Array<{
                group: string,
                duration: number,
                startDate: Date
            }> = [];

            // create all lessons
            for (const lesson in lessons) {
                if (lessons.hasOwnProperty(lesson)) {
                    // get end and start by groupLesson end/start or filter end/start
                    // fixme filter start date is not the correct weekday
                    const lessonStart: Date = new Date((lessons[lesson]['startDate'] < this.filterStartDate) ? this.filterStartDate : lessons[lesson]['startDate']);
                    const lessonEnd: Date = new Date((lessons[lesson]['end']) ? (lessons[lesson]['end'] < this.filterEndDate) ? this.filterEndDate : lessons[lesson]['end'] : this.filterEndDate);
                    console.log(`add lesson ${lesson} from: ${lessonStart} to ${lessonEnd}`);
                    switch (lessons[lesson]['frequency']) {
                        default:
                        case 0:
                            allLessons.push({
                                group: lessons[lesson]['group'],
                                duration: lessons[lesson]['duration'],
                                startDate: lessonStart
                            });
                            break;
                        case 7:
                        case 14:
                            const weeksBetween = HelperService.weeksBetween(lessonStart, lessonEnd);
                            for (let i = 0; i < weeksBetween; i++) {
                                if (i % 2 === 0 && lessons[lesson]['frequency'] === 14) {
                                    continue;
                                }
                                // todo skip holidays
                                // console.log('days since start' + (i * 7));
                                allLessons.push({
                                    group: lessons[lesson]['group'],
                                    duration: lessons[lesson]['duration'],
                                    startDate: HelperService.addDays(lessonStart, i * 7)
                                });
                            }
                            break;
                        case 30:
                            // fixme frequency is wrong
                            for (let i = 0; i < HelperService.monthBetween(lessonStart, lessonEnd); i++) {
                                lessonStart.setMonth(lessonStart.getDate() + i);
                                allLessons.push({
                                    group: lessons[lesson]['group'],
                                    duration: lessons[lesson]['duration'],
                                    startDate: lessonStart
                                });
                            }
                            break;
                    }
                }
            }
            console.log(allLessons);

            // push all lessons as events to this.events
            allLessons.forEach(lesson => {
                const endDate = lesson.startDate;
                endDate.setHours(lesson.duration);

                const key = lesson.startDate.toLocaleDateString().split('.')[2] + '-'
                    + lesson.startDate.toLocaleDateString().split('.')[1] + '-'
                    + lesson.startDate.toLocaleDateString().split('.')[0];

                if (!this.events[key]) {
                    // hint array has no date-index
                }

                console.log(`push lesson to ${key}`);
                console.log(this.events);
                // fixme key did not exist in array find index with the same date or add a new
                this.events[key].push({
                    title: 'Gruppenstunde',
                    description: '',
                    date: HelperService.formatDateToTimespanString(lesson.startDate, endDate), // todo
                    dateStart: lesson.startDate, // todo
                    dateEnd: endDate, // todo
                    groups: [lesson.group],
                    competent: null,
                    public: true,
                    id: null,
                    creator: null
                });

            });
            console.log('added all lessons to event');
            console.log(this.events);

        }

        // todo
        // if (tasks) {
        //     // tslint:disable-next-line:forin
        //     for (const x in Object.keys(lessons)) {
        //         const key = Object.keys(lessons)[x];
        //         if (!this.events[key]) {
        //             this.events.push([]);
        //         }
        //         for (let i = 0; i < lessons[key].length; i++) {
        //             this.events[x].push({
        //                 title: 'Gruppenstunde',
        //                 description: '',
        //                 date: HelperService.formatDateToTimespanString(new Date(), new Date()), // todo
        //                 dateStart: new Date(), // todo
        //                 dateEnd: new Date(), // todo
        //                 groups: lessons[key][i],
        //                 competent: lessons[key][i].leader,
        //                 public: true,
        //                 id: lessons[key][i]._id,
        //                 creator: lessons[key][i].creator
        //             });
        //         }
        //     }
        // }

    }

    /**
     * reload the event list with the new filter parameter
     */
    async applyFilter() {
        let startDate: Date = new Date(this.filterStartDate);
        let endDate: Date = new Date(this.filterEndDate);
        const groupIds: string[] = [];
        for (let i = 0; i < this.allGroups.length; i++) {
            if (this.allGroups[i].selected) {
                groupIds.push(this.allGroups[i].id);
            }
        }
        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        endDate = new Date(endDate.getFullYear(), endDate.getMonth(), 31);

        let lessons = null;
        let events = null;
        const task = null;

        const callStack = [];
        if (this.filterSelectedTypes.lesson) {
            // todo get lessons with filter
            callStack.push(this.http.getLessons().then(l => lessons = l));
        }
        if (this.filterSelectedTypes.event) {
            callStack.push(this.http.getEvents(startDate.toISOString(), endDate.toISOString(), groupIds).then(e => events = e));
        }
        if (this.filterSelectedTypes.task) {
            // callStack.push(this.http.getTask().then(t => task = t));
        }
        await Promise.all(callStack);
        this.drawCalendar(events, lessons, task);
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
                filterSelectedGroups: this.allGroups,
                filterSelectedTypes: this.filterSelectedTypes
            }
        });

        popover.onDidDismiss()
            .then((result) => {
                if (result['data'] !== undefined) {
                    console.log(result['data']);
                    this.filterStartDate = result['data']['filterStartDate'];
                    this.filterEndDate = result['data']['filterEndDate'];
                    this.allGroups = result['data']['groups'];
                    this.filterSelectedTypes = result['data']['types'];
                    this.applyFilter();
                }
            });

        return await popover.present();
    }
}
