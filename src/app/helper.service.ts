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
     * @returns string of colors for groups
     * @param json: json array of groups from backend
     */
    public static getColorArrayFromGroupArray(json): string[] {
        const returnString = [];
        json.forEach(group => {
            returnString.push(group['color']);
        });
        return returnString;
    }

    /**
     * calculate the number of weeks between two dates
     * https://stackoverflow.com/questions/11343939/how-to-add-weeks-to-date-using-javascript
     * @param dateFrom
     * @param dateTo
     */
    public static weeksBetween(dateFrom: Date, dateTo: Date) {
        dateFrom = new Date(dateFrom);
        dateTo = new Date(dateTo);

        const weeks = Math.floor((dateTo.getTime() - dateFrom.getTime()) / (7 * 24 * 60 * 60 * 1000));
        console.log('calculate weeksBetween for: ' + dateFrom + ' -> ' + dateTo + ' : ' + weeks);
        console.log(weeks);
        return weeks;
    }

    /**
     * calculate the number of month between two dates
     * https://stackoverflow.com/questions/2536379/difference-in-months-between-two-dates-in-javascript
     * @param dateFrom
     * @param dateTo
     */
    public static monthBetween(dateFrom, dateTo) {
        dateFrom = new Date(dateFrom);
        dateTo = new Date(dateTo);

        const months = dateTo.getMonth() - dateFrom.getMonth() +
            (12 * (dateTo.getFullYear() - dateFrom.getFullYear()));

        console.log('calculate monthBetween for: ' + dateFrom + ' -> ' + dateTo + ' : ' + months);
        return months;
    }

    /**
     * https://stackoverflow.com/questions/563406/add-days-to-javascript-date?page=1&tab=votes#tab-top
     * @param date
     * @param days
     */
    public static addDays(date, days): Date {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        // console.log(`add ${days} days to ${date} is ${result}`);
        return result;
    }

    /**
     * https://codereview.stackexchange.com/questions/33527/find-next-occurring-friday-or-any-dayofweek
     * @param date
     * @param dayOfWeek
     */
    public static getNextDayOfWeek(date, dayOfWeek) {
        const resultDate = new Date(date.getTime());
        resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);
        console.log(`adjust date to weekday ${date.getDay()} Date: ${date} Result: ${resultDate}`);
        return resultDate;
    }
}



