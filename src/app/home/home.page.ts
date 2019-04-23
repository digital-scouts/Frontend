import {Component} from '@angular/core';
import {Storage} from '@ionic/storage';
import {HttpServiceService} from '../http-service.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    constructor(
        private storage: Storage,
        private router: Router,
        private http: HttpServiceService
    ) {
    }

    ionViewWillEnter() {
        // goToLogin when not logged in
        this.http.getAndSetUserData().then(res => !res ? this.router.navigate(['/login']) : null);
    }

    fPw_click() {
        this.storage.clear();
    }
}
