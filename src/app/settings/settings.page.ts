import {Component, OnInit} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {HttpServiceService} from '../http-service.service';
import {ModalController} from '@ionic/angular';
import {ModalEditGroupComponent} from '../modal-group-edit/modal-edit-group.component';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

    constructor(
        private storage: Storage,
        private router: Router,
        private http: HttpServiceService,
        private modal: ModalController,
    ) {

    }

    public groups: Array<{ logo: string; name: string, id: string }> = [];

    ngOnInit() {
        this.http.getGroups().then(groups => {
            this.drawGroups(groups);
        });
    }

    /**
     *
     * @param groups
     */
    private drawGroups(groups) {
        for (let i = 0; i < groups.length; i++) {
            this.groups.push({
                logo: (groups[i].logo !== undefined) ? groups[i].logo : '',
                name: groups[i].name,
                id: groups[i]._id
            });
        }
    }

    public async editGroup_click(id: string) {
        console.log('edit Group Clicked for id: ' + id);
        const myModal = await this.modal.create({
            component: ModalEditGroupComponent,
            componentProps: {'id': id}
        });
        myModal.present();
    }

    public addGroup_click() {
        this.editGroup_click(null);
    }

    fPw_click() {
        this.storage.clear();
        this.router.navigate(['home']);
    }

}
