import {Component, OnInit} from '@angular/core';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    constructor(
        private storage: Storage,
    ) {
    }

    ngOnInit() {
    }

    rememberPw() {
        this.storage.set('isRememberPw', String(true));
    }

    fPw() {
        this.storage.set('isRememberPw', String(false));
    }
}
