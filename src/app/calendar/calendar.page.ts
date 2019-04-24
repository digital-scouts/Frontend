import {Component, OnInit} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {HttpServiceService} from '../http-service.service';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.page.html',
    styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

    constructor(
        private storage: Storage,
        private router: Router,
        private http: HttpServiceService
    ) {
    }

    public events: Array<{ title: string; date: string; icon: string }> = [];

    /**
     * todo timespan
     * format a date to short timespan String
     * @param startDate
     */
    private static formatDateToString(startDate: Date, endDate: Date): string {
        startDate.setTime(startDate.getTime() + startDate.getTimezoneOffset() * 60 * 1000);
        const now: Date = new Date();

        const dd = (startDate.getDate() > 9 ? '' : '0') + startDate.getDate();
        const mm = ((startDate.getMonth() + 1) > 9 ? '' : '0') + (startDate.getMonth() + 1);
        let formattedDate = `${dd}.${mm}.`;

        if (now.getFullYear() !== startDate.getFullYear()) {
            formattedDate += `${startDate.getFullYear()}`;
        }
        if (startDate.toLocaleTimeString().split(':')[0] !== '00') {
            formattedDate += ' ' + startDate.toLocaleTimeString().split(':')[0] + ':' + startDate.toLocaleTimeString().split(':')[1];
        }
        return formattedDate;
    }

    ionViewWillEnter() {
        // goToLogin when not logged in
        this.http.getAndSetUserData().then(res => !res ? this.router.navigate(['/login']) : null);
    }

    ngOnInit() {
        this.http.getEvents().then(events => {
            // @ts-ignore
            for (let i = 0; i < events.length; i++) {
                console.log(events[i].eventName);
                this.events.push({
                    title: events[i].eventName,
                    date: CalendarPage.formatDateToString(new Date(events[i].dateStart), new Date(events[i].dateEnd)),
                    icon: ''
                });
            }
        });
    }

}
