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
            this.updateUserInformation();
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
    private async isLoggedIn() {
        if (await this.storage.get('isRememberPw')) {
            const pw = await this.storage.get('pw');
            const email = await this.storage.get('email');
            console.log(email);
            console.log(pw);
            if (email && pw) {
                console.log(await this.http.auth(email, pw));
            }
        } else {
            console.log('is not RememberPw ');
            return false;
        }
        console.log('User is not logged in');
        console.log(await HttpServiceService.prototype.auth('lange', 'test'));
    }

    /**
     * @todo
     * Update the user information´s in the app
     */
    private updateUserInformation() {
        console.log('User information´s are now up to Date');
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
