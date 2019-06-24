import {Component, OnInit} from '@angular/core';
import {HttpServiceService} from '../http-service.service';
import {HelperService} from '../helper.service';

@Component({
    selector: 'app-admin-account',
    templateUrl: './admin-account.page.html',
    styleUrls: ['./admin-account.page.scss'],
})
export class AdminAccountPage implements OnInit {

    public users: Array<{
        name_first: string,
        name_last: string,
        age: number,
        group: number,
        role: string,
        image_profile: string,
        accountStatus: {
            namiLink: number,
            activated: boolean,
            disabled: boolean,
            inactive: boolean
        },
    }> = [];

    allGroups = this.helper.getAllGroups();

    constructor(private http: HttpServiceService, private helper: HelperService) {
    }

    ngOnInit() {
        this.http.getAllUser().then((data) => {
            // tslint:disable-next-line:forin
            for (const x in Object.keys(data)) {
                this.users.push({
                    name_first: data[x]['name_first'],
                    name_last: data[x]['name_last'],
                    age: data[x]['name_last'],
                    group: data[x]['name_last'],
                    image_profile: data[x]['name_last'],
                    role: data[x]['name_last'],
                    accountStatus: {
                        namiLink: data[x]['accountStatus']['namiLink'],
                        activated: data[x]['accountStatus']['activated'],
                        disabled: data[x]['accountStatus']['disabled'],
                        inactive: data[x]['accountStatus']['inactive'],
                    }
                });
            }
        });
    }

}
