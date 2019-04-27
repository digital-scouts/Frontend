import {Component, OnInit} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {HttpServiceService} from '../http-service.service';
import {ModalController} from '@ionic/angular';
import {AddEventComponent} from '../add-event/add-event.component';
import {HelperService} from '../helper.service';

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
        // set filter dates
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
            this.hideAddEventBtn = !(role === 'admin' || role === 'leader');
        });
    }


    public events: Array<{ title: string; date: string; icon: string }> = [];
    hideAddEventBtn = true;
    filterEndDate: string;
    filterStartDate: string;

    filterDateMin: string;
    filterDateMax: string;

    ionViewWillEnter() {
        // goToLogin when not logged in
        this.http.getAndSetUserData().then(res => !res ? this.router.navigate(['/login']) : null);
        // todo check if user is leader or admin and than show hideAddEventBtn
    }

    ngOnInit() {
        this.http.getEvents().then(events => {
            this.drawCalendar(events);
        });
    }

    private drawCalendar(events) {
        this.events = [];
        for (let i = 0; i < events.length; i++) {
            this.events.push({
                title: events[i].eventName,
                date: HelperService.formatDateToTimespanString(new Date(events[i].dateStart), new Date(events[i].dateEnd)),
                icon: ''
            });
        }
    }

    async openAddEventModal() {
        const myModal = await this.modal.create({component: AddEventComponent});
        myModal.present();
    }

    /**
     * reload the event list with the new filter parameter
     */
    applyFilter() {
        let startDate: Date = new Date(this.filterStartDate);
        let endDate: Date = new Date(this.filterEndDate);

        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        endDate = new Date(endDate.getFullYear(), endDate.getMonth(), 31);

        console.log(startDate);
        console.log(endDate);
        this.http.getEvents(startDate.toISOString(), endDate.toISOString()).then(events => {
            console.log(events);
            this.drawCalendar(events);
        });
    }
}
