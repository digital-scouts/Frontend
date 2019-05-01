import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {HttpServiceService} from '../http-service.service';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.page.html',
    styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

    password_reg: string;
    group_reg: string;
    email_reg: string;
    nameLast_reg: string;
    nameFirst_reg: string;

    groups = ['woe', 'jufi'];
    constructor(
        private router: Router,
        private storage: Storage,
        private http: HttpServiceService,
    ) {
    }

    ngOnInit() {
    }

    register_click() {
        this.http.newUser(this.nameFirst_reg, this.nameLast_reg, this.email_reg, this.password_reg, this.group_reg).then(data => {
            alert('erfolgreich angemeldet, deine anmeldung muss nun von einem admin bestätigt werden');
        });
    }

}
