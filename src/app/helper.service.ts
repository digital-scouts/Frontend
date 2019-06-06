import {Injectable} from '@angular/core';
import * as moment from 'moment';

moment.locale('de');

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
            isSameDay: moment(startDate).isSame(endDate, 'day'),
            isFullDay: (moment(startDate).hour() === 0 && moment(endDate).hour() === 0),
            startTime: moment(startDate).format('HH:mm'),
            endTime: moment(endDate).format('HH:mm'),
            formattedStartDate: null,
            formattedEndDate: null,
            formattedTimeSpan: null,
            weekDay: moment(startDate).format('dd'),
        };
        date.formattedTimeSpan = date.startTime + ' bis ' + date.endTime;
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
        // console.log('calculate weeksBetween for: ' + dateFrom + ' -> ' + dateTo + ' : ' + weeks);
        // console.log(weeks);
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

        // console.log('calculate monthBetween for: ' + dateFrom + ' -> ' + dateTo + ' : ' + months);
        return months;
    }

    /**
     * https://codereview.stackexchange.com/questions/33527/find-next-occurring-friday-or-any-dayofweek
     * @param date
     * @param dayOfWeek
     */
    public static getNextDayOfWeek(date, dayOfWeek) {
        const resultDate = new Date(date.getTime());
        resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);
        // console.log(`adjust date to weekday ${date.getDay()} Date: ${date} Result: ${resultDate}`);
        return resultDate;
    }
}



