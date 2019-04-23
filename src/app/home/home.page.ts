import {Component} from '@angular/core';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    constructor(
        private storage: Storage,
    ) {
    }

    async fPw_click() {
        this.storage.remove('email');
        this.storage.remove('pw');
    }
}
