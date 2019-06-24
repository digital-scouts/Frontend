import {Component, OnInit} from '@angular/core';
import {HttpServiceService} from '../http-service.service';
import {HelperService} from '../helper.service';
import {ModalController} from '@ionic/angular';
import {ModalAdminUserDetailsComponent} from '../modal-admin-user-details/modal-admin-user-details.component';

@Component({
    selector: 'app-admin-account',
    templateUrl: './admin-account.page.html',
    styleUrls: ['./admin-account.page.scss'],
})
export class AdminAccountPage implements OnInit {

    public users: Array<{
        id: string,
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

    constructor(private http: HttpServiceService, private helper: HelperService, private modal: ModalController) {
    }

    ngOnInit() {
        this.http.getAllUser().then((data) => {
            // tslint:disable-next-line:forin
            for (const x in Object.keys(data)) {
                this.users.push({
                    id: data[x]['_id'],
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

    async seeUserDetailsModalOpen(id: string) {
        const user = this.users.find((el) => {
            return el.id === id;
        });
        console.log(user);
        const myModal = await this.modal.create({
            component: ModalAdminUserDetailsComponent,
            componentProps: {'user': user}
        });

        myModal.present();
        const {data} = await myModal.onDidDismiss();
    }

}
