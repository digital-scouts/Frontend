import {Injectable} from '@angular/core';
import * as moment from 'moment';
import {HttpServiceService} from './http-service.service';

moment.locale('de');

@Injectable({
    providedIn: 'root'
})
export class HelperService {

    constructor(private http: HttpServiceService) {

    }

    /**
     * format a displayDate to short timespan String
     * @param startDate
     * @param endDate
     */
    public static formatDateToTimespanString(startDate: Date, endDate: Date): { isSameDay: boolean, isFullDay: boolean, startTime: string, endTime: string, formattedStartDate: string, formattedEndDate: string, formattedTimeSpan: string, weekDay: string, month: string } {
        const date = {
            isSameDay: moment(startDate).isSame(endDate, 'day'),
            isFullDay: (moment(startDate).hour() === 0 && moment(endDate).hour() === 0),
            startTime: moment(startDate).format('HH:mm'),
            endTime: moment(endDate).format('HH:mm'),
            formattedStartDate: null,
            formattedEndDate: null,
            formattedTimeSpan: null,
            weekDay: moment(startDate).format('dd'),
            month: moment(startDate).format('MMMM')
        };
        date.formattedTimeSpan = date.startTime + ' bis ' + date.endTime;
        return date;
    }

    /**
     * DD.MM.YYYY date to YYYY-MM-DD
     * @param date
     */
    static gerDateToISO(date: string): string {
        return moment(`${date.split('.')[2]}-${date.split('.')[1]}-${date.split('.')[0]}`).format('YYYY-MM-DD');
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


    getAllGroups(): Array<{ id: string, color: string, name: string, isChildGroup: boolean }> {
        const allGroups: Array<{
            id: string,
            color: string,
            name: string,
            isChildGroup: boolean,
        }> = [];

        this.http.getGroups().then(groups => {
            // @ts-ignore
            for (let i = 0; i < groups.length; i++) {
                allGroups.push({
                    id: groups[i]['_id'],
                    color: groups[i]['color'],
                    name: groups[i]['name'],
                    isChildGroup: groups[i]['childGroup'],
                });
            }
        });

        return allGroups;
    }
}



