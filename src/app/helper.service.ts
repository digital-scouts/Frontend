import {Injectable} from '@angular/core';
import * as moment from 'moment';
import {HttpServiceService} from './http-service.service';

moment.locale('de');

@Injectable({
    providedIn: 'root'
})
export class HelperService {
    monthList = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'July', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    weeksList = ['S', 'M', 'D', 'M', 'D', 'F', 'S'];

    public datePickerObj = {
        closeOnSelect: true, // default false
        mondayFirst: true, // default false
        todayLabel: 'Heute', // default 'Today'
        closeLabel: 'Abbrechen', // default 'Close'
        clearButton: false, // default true
        momentLocale: 'de-DE', // Default 'en-US'
        monthsList: this.monthList,
        weeksList: this.weeksList,
        dateFormat: 'DD.MM.YYYY', // default DD MMM YYYY
    };

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
    static getDateToISO(date: string): string {
        return moment(`${date.split('.')[2]}-${date.split('.')[1]}-${date.split('.')[0]}`).format('YYYY-MM-DD');
    }

    /**
     * todo Passwort verschlüsseln
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

            allGroups.sort((a, b) => {
                // console.log(`Compare ${a.name}=${getPower(a.name)} with ${b.name}=${getPower(b.name)} => ${getPower(a.name) - getPower(b.name)}`);

                function getPower(groupName) {
                    switch (groupName) {
                        case 'Bieber':
                            return 0;
                        case 'Wölflinge':
                            return 1;
                        case 'Jungpfadfinder':
                            return 2;
                        case 'Pfadfinder':
                            return 3;
                        case 'Rover':
                            return 4;
                        default:
                            // console.log(`Group '${groupName}' not found.`);
                            return 10;
                    }
                }

                return getPower(a.name) - getPower(b.name);
            });

            // console.log(allGroups);
        });

        // console.log(allGroups);

        return allGroups;
    }
}



