import {Injectable} from '@angular/core';
import * as moment from 'moment';
import {HttpServiceService} from './http-service.service';
import {ToastController} from '@ionic/angular';
import {Md5} from 'ts-md5';

moment.locale('de');

@Injectable({
    providedIn: 'root'
})
export class HelperService {

    constructor(private http: HttpServiceService,  public toastController: ToastController) {

    }

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
    static decodePW(pw: string): string {
        const md5 = new Md5();
        // console.log(md5.appendStr('hello').end());
        // return <string>md5.appendStr('hello').end();
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
     * return email when string includes a email address
     * @param text
     */
    public static matchEmailRegex(text: string) {

        const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/g;
        // console.log("matchEmailRegex: " + text);
        const emails = text.match(emailRegex);
        // console.log(emails);
        if (emails == null) {
            return [];
        }
        return emails;
    }

    /**
     * return array of emails for user
     * @param user
     */
    public static getEmailsFromUser(user) {
        const allMails = [];

        if (user['dbData'] != null) {
            allMails.push(`${user['dbData']['name_first']} ${user['dbData']['name_last']} <${user['dbData']['email']}>`);
        }
        if (user['namiData'] != null) {
            if (user['namiData']['email']) {
                allMails.push(`${user['namiData']['vorname']} ${user['namiData']['nachname']} <${user['namiData']['email']}>`);
            }
            if (user['namiData']['emailVertretungsberechtigter']) {
                allMails.push(`Fam. ${user['namiData']['nachname']} <${user['namiData']['emailVertretungsberechtigter']}>`);
            }
            // hint it is possible to save text/email in telefax or telefon
            if (HelperService.matchEmailRegex(user['namiData']['telefax']).length) {
                allMails.push(user['namiData']['telefax']);
            }
            if (HelperService.matchEmailRegex(user['namiData']['telefon3']).length) {
                allMails.push(user['namiData']['telefon3']);
            }
            if (HelperService.matchEmailRegex(user['namiData']['telefon2']).length) {
                allMails.push(user['namiData']['telefon2']);
            }
            if (HelperService.matchEmailRegex(user['namiData']['telefon1']).length) {
                allMails.push(user['namiData']['telefon1']);
            }
        }
        return allMails;
    }

    /**
     * return array of telefon numbers for user
     * @param user
     */
    public static getTelefonFromUser(user) {
        const allTelefon = [];
        if (user['namiData']) {
            if (user['namiData']['telefon1'] && !HelperService.matchEmailRegex(user['namiData']['telefon1']).length) {
                allTelefon.push(user['namiData']['telefon1']);
            }
            if (user['namiData']['telefon2'] && !HelperService.matchEmailRegex(user['namiData']['telefon2']).length) {
                allTelefon.push(user['namiData']['telefon2']);
            }
            if (user['namiData']['telefon3'] && !HelperService.matchEmailRegex(user['namiData']['telefon3']).length) {
                allTelefon.push(user['namiData']['telefon3']);
            }
        }
        return allTelefon;
    }

    /**
     *
     * @param msg
     * @param {string} position default bottom
     * @param {number} duration default 2000
     * @return {Promise<any>}
     */
    public async showToast(msg, position: 'top' | 'bottom' | 'middle' = 'bottom', duration = 2000) {
        const toast = await this.toastController.create({
            position: position,
            message: msg,
            duration: duration
        });
        await toast.present();
        return toast;
    }

    public getAllGroups(): Array<{ id: string, color: string, name: string, isChildGroup: boolean }> {
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



