import {Component, OnInit} from '@angular/core';
import {HttpServiceService} from '../http-service.service';
import {Storage} from '@ionic/storage';
import {LoadingController} from '@ionic/angular';

@Component({
    selector: 'app-group-management',
    templateUrl: './group-management.page.html',
    styleUrls: ['./group-management.page.scss'],
})
export class GroupManagementPage implements OnInit {

    constructor(private http: HttpServiceService, private storage: Storage, public loadingController: LoadingController) {
    }

    users;

    async ngOnInit() {
        this.presentLoadingWithOptions();
        this.http.getAllUser(await this.storage.get('group')).then(data => {
            this.users = data;
            console.log(data);
            this.loadingController.dismiss();
        });
    }

    async presentLoadingWithOptions() {
        const loading = await this.loadingController.create({
            spinner: 'circles',
            message: 'Gruppe wird geladen...',
            translucent: true,
            backdropDismiss:true
        });
        return await loading.present();
    }

}
