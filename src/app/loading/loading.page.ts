import {Component, OnInit} from '@angular/core';
import {LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage';
import {Platform} from '@ionic/angular';
import {HttpServiceService} from '../http-service.service';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.page.html',
    styleUrls: ['./loading.page.scss'],
})
export class LoadingPage implements OnInit {

    constructor(
        private storage: Storage,
        private router: Router,
        private loadingController: LoadingController,
        private plt: Platform,
        private http: HttpServiceService
    ) {
        console.log('HEIGHT: ' + this.plt.height());
        storage.set('height', this.plt.height());

        console.log('WIDTH: ' + this.plt.width());
        storage.set('width', this.plt.width());

        console.log('PORTRAIT: ' + this.plt.isPortrait());

        if (this.plt.is('android')) {
            console.log('DEVICE: android');
        } else if (this.plt.is('ios')) {
            console.log('DEVICE: ios');
        }
        if (this.plt.is('desktop')) {
            console.log('DEVICE: desktop');
            this.mobile = false;
        }
        if (this.plt.is('cordova')) {
            console.log('DEVICE: cordova');
            this.mobile = true;
        }

        storage.set('isMobile', this.mobile);
        // for statistics 'this.plt.versions'
    }

    loadingElement;
    platform;
    url;
    mobile = false;

    /**
     *
     */
    ngOnInit() {
        this.manageLogin();
    }

    private async manageLogin() {
        await this.presentLoading();
        if (await this.isLoggedIn()) {// already logged in
            this.goToHome();
        } else {
            this.goToLogin();
        }
        this.dismissLoading();
    }

    /**
     * todo make a own loadingscreen animation
     * create the loadingController and present it
     */
    async presentLoading() {
        this.loadingElement = await this.loadingController.create({
            spinner: 'bubbles'
        });
        await this.loadingElement.present();
    }

    /**
     * dismiss the loadingElement
     */
    async dismissLoading() {
        await this.loadingElement.dismiss();
    }

    /**
     * Check if logindate is saved and login
     * @returns boolean
     */
    private isLoggedIn() {
        return new Promise(async resolve => {
            this.http.test_connection(await this.storage.get('token')).then(async isTokenValid => {
                const pw: string = await this.storage.get('pw');
                const email: string = await this.storage.get('email');
                if (isTokenValid) {
                    console.log('token is valid');
                    resolve(true);
                } else if (!!(pw && email)) {
                    console.log('is RememberPw ');
                    console.log('E-Mail: ' + email);
                    console.log('Password: ' + pw);
                    this.http.auth(email, pw, true).then(isAuthTrue => resolve(isAuthTrue));
                } else {
                    console.log('is not RememberPw ');
                    resolve(false);
                }
            });
        });
    }

    /**
     * @todo
     * close this page and navigate to home
     */
    private goToHome() {
        this.router.navigate(['/home']);
    }

    /**
     * navigate to LoginPage
     */
    private goToLogin() {
        this.router.navigate(['/login']);
    }
}
