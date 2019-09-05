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

    public users: Array<Array<{
        id: string,
        name_first: string,
        name_last: string,
        age: number,
        group: {
            leader: string[],
            name: string,
            color: string
        },
        role: string,
        image_profile: string,
        accountStatus: {
            namiLink: number,
            activated: boolean,
            disabled: boolean,
            inactive: boolean
        },
    }>> = [];

    allGroups = this.helper.getAllGroups();
    slideOpts = {
        initialSlide: 1,
        speed: 400,
        height: 300
    };

    constructor(private http: HttpServiceService, private helper: HelperService, private modal: ModalController) {
    }

    ngOnInit() {
        this.loadAllUser();
    }

    loadAllUser() {
        this.http.adminGetAllUser().then((data) => {
            this.users = [[], [], [], [], []];
            // tslint:disable-next-line:forin
            for (const x in Object.keys(data)) {
                let group = null;

                let groupIndex = 0;
                if (data[x]['group']) {
                    group = {
                        leader: data[x]['group']['leader'],
                        name: data[x]['group']['name'],
                        color: data[x]['group']['color']
                    };
                    switch (data[x]['group']['name']) {
                        case 'Wölflinge':
                            groupIndex = 1;
                            break;
                        case 'Jungpfadfinder':
                            groupIndex = 2;
                            break;
                        case 'Pfadfinder':
                            groupIndex = 3;
                            break;
                        case 'Rover':
                            groupIndex = 4;
                            break;
                    }
                }

                this.users[groupIndex].push({
                    id: data[x]['_id'],
                    name_first: data[x]['name_first'],
                    name_last: data[x]['name_last'],
                    age: data[x]['name_last'],
                    group: group,
                    image_profile: data[x]['image_profile'],
                    role: data[x]['role'],
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

    async seeUserDetailsModalOpen(user) {
        console.log(user);
        const myModal = await this.modal.create({
            component: ModalAdminUserDetailsComponent,
            componentProps: {'user': user}
        });

        myModal.present();
        const {data} = await myModal.onDidDismiss();
        this.loadAllUser();
    }

}
