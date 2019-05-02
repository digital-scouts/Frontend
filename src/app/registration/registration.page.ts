import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {HttpServiceService} from '../http-service.service';
import {HelperService} from '../helper.service';
import {ToastController} from '@ionic/angular';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.page.html',
    styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

    constructor(
        private router: Router,
        private storage: Storage,
        private http: HttpServiceService,
        public toastController: ToastController
    ) {
    }

    password1_reg = '';
    password2_reg = '';
    group_reg: string;
    email_reg = '';
    nameLast_reg = '';
    nameFirst_reg = '';

    // todo load from backend
    groups = ['Wölfling', 'Jungpfadfinder', 'Pfadfinder', 'Rover', 'leader', 'Mutter/Vater'];
    private outFillIdx = 0;
    private isLogin = false;

    ngOnInit() {
    }

    /**
     * handle register
     * todo show react on btn click (loading)
     * todo handle wrong login
     */
    register() {
        this.http.newUser(this.nameFirst_reg, this.nameLast_reg, this.email_reg, HelperService.encodePW(this.password1_reg), this.group_reg).then(data => {
            alert('erfolgreich angemeldet, deine anmeldung muss nun von einem admin bestätigt werden');
            if (data) {
                this.router.navigate(['/home']);
            }
        });
    }

    /**
     * handle login
     * todo show react on btn click (loading)
     * todo handle wrong login
     */
    async login() {
        this.http.auth(this.email_reg, HelperService.encodePW(this.password2_reg), true).then(res => {
            if (res) {
                this.router.navigate(['/home']);
            }
        });
    }

    async notValid(id: string, msg: string) {
        document.getElementById(id).classList.add('notValid');

        const toast = await this.toastController.create({
            message: msg,
            duration: 2000
        });
        toast.present();
        setTimeout(() => {
            document.getElementById(id).classList.remove('notValid');
        }, 5000);
    }

    next_click(input_type: string) {
        let old_el = null;
        let new_el = null;
        switch (input_type) {
            case 'name1':
                if (this.nameFirst_reg.length < 2) {
                    this.notValid('name1', 'Bitte gibt deinen Vornamen ein.');
                    break;
                }
                old_el = document.getElementById('name1');
                new_el = document.getElementById('name2');
                break;
            case 'name2':
                if (this.nameLast_reg.length < 2) {
                    this.notValid('name2', 'Bitte gibt deinen Nachnamen ein.');
                    break;
                }
                old_el = document.getElementById('name2');
                new_el = document.getElementById('email');
                break;
            case 'email':
                if (!this.email_reg.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
                    this.notValid('email', 'Bitte gib eine gültige E-Mail-Adresse ein. Frage deine Eltern, wenn du keine hast.');
                    break;
                }
                if (this.isLogin) {
                    new_el = document.getElementById('password2');
                } else {
                    new_el = document.getElementById('group');
                }
                old_el = document.getElementById('email');

                break;
            case 'group':
                if (!this.groups.includes(this.group_reg)) {
                    this.notValid('group', 'Bitte wähle eine Gruppe aus.');
                    break;
                }
                old_el = document.getElementById('group');
                new_el = document.getElementById('password1');
                break;
            case 'password1':
                if (!this.password1_reg.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/)) {
                    this.notValid('password1', 'Das Password ist nicht sicher genug.');
                    break;
                }
                old_el = document.getElementById('password1');
                new_el = document.getElementById('password2');
                break;
            case 'password2':
                if (this.isLogin) {
                    this.login();
                } else {
                    if (this.password1_reg !== this.password2_reg) {
                        this.notValid('password2', 'Die Passwörter stimmen nicht überein.');
                        break;
                    }
                    this.register();

                }
                break;
            case 'startLogin':
                unsetAll(['name1', 'name2', 'group', 'password1', 'password2']);
                new_el = document.getElementById('email');
                this.outFillIdx = 0;
                break;
            case 'startRegister':
                unsetAll(['email', 'password1']);
                new_el = document.getElementById('name1');
                this.outFillIdx = 0;
                break;
        }
        if (old_el != null) {
            old_el.classList.add('inactive');
            old_el.classList.remove('notValid');
            old_el.classList.add('stored');
            old_el.classList.remove('unstored');
            this.outFillIdx++;
            document.getElementById('storage').classList.remove('hidden');
        }
        if (new_el != null) {
            new_el.classList.remove('inactive');
        }

        function unsetAll(all) {
            for (let i = 0; i < all.length; i++) {
                document.getElementById(all[i]).classList.add('inactive');
            }
            document.getElementById('storage').classList.add('hidden');
        }
    }

    /**
     * handle animation for storage click
     */
    prev_click() {
        if (this.outFillIdx > 0) {
            if (this.isLogin) {
                document.getElementById('password1').classList.add('inactive');
                document.getElementById('email').classList.add('unstored');
                document.getElementById('email').classList.remove('stored');
                document.getElementById('email').classList.remove('inactive');
                this.outFillIdx--;
            } else {
                const elements = document.getElementsByClassName('input');
                elements[this.outFillIdx].classList.add('inactive');
                this.outFillIdx--;
                elements[this.outFillIdx].classList.add('unstored');
                elements[this.outFillIdx].classList.remove('stored');
                elements[this.outFillIdx].classList.remove('inactive');
            }
        }
        if (this.outFillIdx === 0) {
            document.getElementById('storage').classList.add('hidden');
        }
    }

    goTo_log_reg() {
        if (this.isLogin) {
            this.isLogin = !this.isLogin;
            this.next_click('startRegister');
        } else {
            this.isLogin = !this.isLogin;
            this.next_click('startLogin');
        }
    }

    async goTo_Help() {
        const toast = await this.toastController.create({
            message: 'Hilfe ist noch nicht verfügbar',
            duration: 2000
        });
        toast.present();
    }
}
