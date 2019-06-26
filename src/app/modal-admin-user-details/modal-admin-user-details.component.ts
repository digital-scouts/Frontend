import {Component, OnInit, Input} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {HttpServiceService} from '../http-service.service';

@Component({
    selector: 'app-modal-admin-user-details',
    templateUrl: './modal-admin-user-details.component.html',
    styleUrls: ['./modal-admin-user-details.component.scss'],
})
export class ModalAdminUserDetailsComponent implements OnInit {
    @Input() user;

    constructor(private modal: ModalController, private http: HttpServiceService, private toastController: ToastController) {
    }

    ngOnInit() {
    }

    closeModal() {
        this.modal.dismiss({});
    }

    activateUser() {
        this.http.activateUser(this.user['id']).then(res => {
            if (res['accountStatus']['activated']) {
                this.showToast(this.user['name_first'] + ' wurde aktiviert');
            }
            console.log(res);
            this.closeModal();
        });
    }

    deleteUser() {
        this.http.deleteUser(this.user['id']).then(res => {
            if (res['removedElements']['n'] === 1) {
                this.showToast(this.user['name_first'] + ' wurde gelöscht');
            }
            console.log(res);
            this.closeModal();
        });
    }

    changeDisableUser() {
        this.http.changeDisableUser(this.user['id']).then(res => {
            if (res['accountStatus']['disabled']) {
                this.showToast(this.user['name_first'] + ' wurde deaktiviert');
            } else {
                this.showToast(this.user['name_first'] + ' wurde aktiviert');
            }
            console.log(res);
            this.closeModal();
        });
    }

    async showToast(text: string) {
        const toast = await this.toastController.create({
            message: text,
            duration: 2000
        });
        toast.present();
    }

}
