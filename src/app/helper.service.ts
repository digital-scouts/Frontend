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
     */
    public static formatDateToTimespanString(startDate: Date, endDate: Date): string {
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

}



