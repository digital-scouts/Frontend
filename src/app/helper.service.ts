import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class HelperService {
    /**
     * format a displayDate to short timespan String
     * @param startDate
     * @param endDate
     */
    public static formatDateToTimespanString(startDate: Date, endDate: Date): { isSameDay: boolean, isFullDay: boolean, startTime: string, endTime: string, formattedStartDate: string, formattedEndDate: string, formattedTimeSpan: string, weekDay: string } {
        const date = {
            isSameDay: (startDate.getDate() === endDate.getDate()),
            isFullDay: (startDate.getUTCHours() === 0 && endDate.getUTCHours() === 0),
            startTime: startDate.toLocaleTimeString().split(':')[0] + ':' + startDate.toLocaleTimeString().split(':')[1],
            endTime: endDate.toLocaleTimeString().split(':')[0] + ':' + endDate.toLocaleTimeString().split(':')[1],
            formattedStartDate: HelperService.formatDateTime(startDate, true),
            formattedEndDate: HelperService.formatDateTime(endDate, true),
            formattedTimeSpan: null,
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

        date.formattedTimeSpan = date.startTime + ' bis ' + date.endTime;
        return date;
    }

    /**
     * format date to string with date and time
     * @param date
     * @param withTime
     */
    private static formatDateTime(date: Date, withTime: boolean): string {
        const now: Date = new Date();
        const dd = (date.getDate() > 9 ? '' : '0') + date.getDate();
        const mm = ((date.getMonth() + 1) > 9 ? '' : '0') + (date.getMonth() + 1);
        let formattedDate = `${dd}.${mm}.`;

        if (now.getFullYear() !== date.getFullYear()) {
            formattedDate += `${date.getFullYear()}`;
        }
        if (withTime && date.toLocaleTimeString().split(':')[0] !== '00') {
            formattedDate += ' ' + date.toLocaleTimeString().split(':')[0] + ':' + date.toLocaleTimeString().split(':')[1];
        }
        return formattedDate;
    }

    /**
     * todo
     * @param {string} pw
     * @return {string}
     */
    static encodePW(pw: string): string {
        return pw;
    }

    /**
     *
     * @param json
     */
    public static getColorArrayFromGroupArray(json): string[] {
        const returnString = [];
        json.forEach(group => {
            returnString.push(group['color']);
        });
        return returnString;
    }
}



