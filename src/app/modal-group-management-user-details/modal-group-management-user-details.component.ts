import {Component, Input, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {HttpServiceService} from '../http-service.service';
import {HelperService} from '../helper.service';
import {CallNumber} from '@ionic-native/call-number/ngx';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';

@Component({
    selector: 'app-modal-group-management-user-details',
    templateUrl: './modal-group-management-user-details.component.html',
    styleUrls: ['./modal-group-management-user-details.component.scss'],
})
export class ModalGroupManagementUserDetailsComponent implements OnInit {

    constructor(private modal: ModalController, private http: HttpServiceService, private toastController: ToastController, private callNumber: CallNumber, private iab: InAppBrowser, private helper: HelperService) {
    }

    @Input() user;

    ngOnInit() {
    }

    closeModal() {
        this.modal.dismiss({});
    }

    getAllEmailsForUser(user) {
        return HelperService.getEmailsFromUser(user);
    }

    getAllTelefonForUser(user) {
        return HelperService.getTelefonFromUser(user);
    }

    openBrowser(address) {
        this.iab.create('https://maps.google.com/?q=' + address);
    }

    call(number) {
        console.log('try call: ' + number);
        this.callNumber.callNumber(number, true)
            .then(res => console.log('Launched dialer!', res))
            .catch(err => {
                this.helper.showToast(err, 'bottom');
            });
    }
}
