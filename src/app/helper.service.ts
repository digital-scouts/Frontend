import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class HelperService {

    constructor() {
    }


    /**
     * todo timespan
     * format a displayDate to short timespan String
     * @param startDate
     * @param endDate
     */
    public static formatDateToTimespanString(startDate: Date, endDate: Date): { isSameDay: boolean, isFullDay: boolean, startTime: string, endTime: string, formattedDate: string, weekDay: string} {
        const date = {
            isSameDay: (startDate.getDate() === endDate.getDate()),
            isFullDay: (startDate.getUTCHours() === 0 && endDate.getUTCHours() === 0),
            startTime: startDate.toLocaleTimeString(),
            endTime: endDate.toLocaleTimeString(),
            formattedDate: null,
            weekDay: null,
        };

        startDate.setTime(startDate.getTime() + startDate.getTimezoneOffset() * 60 * 1000);
        endDate.setTime(endDate.getTime() + startDate.getTimezoneOffset() * 60 * 1000);

        switch (startDate.getDay()) {
            case 1:
                date.weekDay = 'Mo';
                break;
            case 2:
                date.weekDay = 'Di';
                break;
            case 3:
                date.weekDay = 'Mi';
                break;
            case 4:
                date.weekDay = 'Do';
                break;
            case 5:
                date.weekDay = 'Fr';
                break;
            case 6:
                date.weekDay = 'Sa';
                break;
            case 0:
                date.weekDay = 'So';
                break;
        }

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
        date.formattedDate = formattedDate;

        return date;
    }

    /**
     * todo
     * @param {string} pw
     * @return {string}
     */
    static encodePW(pw: string): string {
        return pw;
    }
}



