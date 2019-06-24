import {Component, OnInit, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-modal-admin-user-details',
    templateUrl: './modal-admin-user-details.component.html',
    styleUrls: ['./modal-admin-user-details.component.scss'],
})
export class ModalAdminUserDetailsComponent implements OnInit {
    @Input() user;

    constructor(private modal: ModalController) {
    }

    ngOnInit() {
    }

    closeModal() {
        this.modal.dismiss({});
    }

}
