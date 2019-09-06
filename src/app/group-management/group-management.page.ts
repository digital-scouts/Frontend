import {Component, OnInit} from '@angular/core';
import {HttpServiceService} from '../http-service.service';
import {Storage} from '@ionic/storage';
import {LoadingController, ModalController} from '@ionic/angular';
import {ModalAdminUserDetailsComponent} from '../modal-admin-user-details/modal-admin-user-details.component';
import {ModalGroupManagementUserDetailsComponent} from '../modal-group-management-user-details/modal-group-management-user-details.component';

@Component({
    selector: 'app-group-management',
    templateUrl: './group-management.page.html',
    styleUrls: ['./group-management.page.scss'],
})
export class GroupManagementPage implements OnInit {

    constructor(private http: HttpServiceService, private storage: Storage, public loadingController: LoadingController, private modal: ModalController) {
    }

    users;

    async ngOnInit() {
        let dataIsLoad = false;
        await this.presentLoadingWithOptions();
        this.storage.get('group-management-user-data').then(data => {
            if (!dataIsLoad) {
                console.log('storage load data');
                if (data) {
                    this.loadingController.dismiss();
                    this.users = data;
                    dataIsLoad = true;
                }
            }
        });

        this.http.getAllUser(await this.storage.get('group')).then(data => {
            this.users = data;
            console.log('http load data');
            if (!dataIsLoad) {
                this.loadingController.dismiss();
            }
            dataIsLoad = true;
            this.storage.set('group-management-user-data', data);
        });
    }

    async presentLoadingWithOptions() {
        const loading = await this.loadingController.create({
            spinner: 'circles',
            message: 'Gruppe wird geladen...',
            translucent: true,
            backdropDismiss: true
        });
        return await loading.present();
    }

    async seeUserDetailsModalOpen(user) {
        console.log(user);
        const myModal = await this.modal.create({
            component: ModalGroupManagementUserDetailsComponent,
            componentProps: {'user': user}
        });

        await myModal.present();
    }

}
