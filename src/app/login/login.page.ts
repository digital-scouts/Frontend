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
            }
        });
    }


}
