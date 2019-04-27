import {Component, OnInit} from '@angular/core';
import {Storage} from '@ionic/storage';
import {HttpServiceService} from '../http-service.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    username_input: string;
    password_input: string;
    savePw: boolean;

    password_reg: string;
    group_reg: string;
    email_reg: string;
    nameLast_reg: string;
    nameFirst_reg: string;

    constructor(
        private router: Router,
        private storage: Storage,
        private http: HttpServiceService,
    ) {
    }

    ngOnInit() {
    }

    /**
     * handle login
     * todo show react on btn click (loading)
     * todo handle wrong login
     */
    async login_click() {
        this.http.auth(this.username_input, this.password_input, this.savePw).then(res => {
            if (res) {
                this.router.navigate(['/home']);
            } else {
            }
        });
    }

    register_click() {
        this.http.newUser(this.nameFirst_reg, this.nameLast_reg, this.email_reg, this.password_reg, this.group_reg).then(data => {
            alert('erfolgreich angemeldet, deine anmeldung muss nun von einem admin bestätigt werden');
        });
    }
}
