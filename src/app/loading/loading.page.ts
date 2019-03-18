import {Component, OnInit} from '@angular/core';
import {LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {Storage} from '@ionic/storage';
import {HTTP} from '@ionic-native/http/ngx';
import {Platform} from '@ionic/angular';
import {HttpServiceService} from '../http-service.service';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.page.html',
    styleUrls: ['./loading.page.scss'],
})
export class LoadingPage implements OnInit {

    constructor(
        private nativeStorage: NativeStorage,
        private storage: Storage,
        private router: Router,
        private loadingController: LoadingController,
        private plt: Platform,
        private http: HttpServiceService,
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
            alert('cordova available');
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
        if (this.isLoggedIn()) {// already logged in
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
    private isLoggedIn() {

        if (this.mobile) {
            this.nativeStorage.getItem('isRememberPw').then(async isRememberPw => {
                    console.log('isRememberPw: ' + isRememberPw);
                    // password should be saved local
                    if (isRememberPw) {
                        let pw: string;
                        let email: string;
                        this.nativeStorage.getItem('pw').then(res => {
                            console.log('pw: ' + res);
                            pw = res;
                        });
                        this.nativeStorage.getItem('email').then(res => {
                            console.log('pw: ' + res);
                            email = res;
                        });
                        await this.checkFlagToBeAnything(pw);
                        await this.checkFlagToBeAnything(email);
                        console.log(email);
                        console.log(pw);
                        // todo try to login
                    } else {
                        console.log('is not RememberPw ');
                        // goto login
                    }
                },
                error => console.error(error)
            );
        } else {// device is not mobile
            console.log('Device is not mobile, did not check if logged in');
        }
        console.log('User is not logged in');
        return false;
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

    private checkFlagToBeValue(flag, value): any {
        if (value === flag) {
            return true;
        } else {
            setTimeout(this.checkFlagToBeValue(flag, value), 100);
        }
    }

    private checkFlagToBeAnything(flag): any {
        if (flag != null) {
            return true;
        } else {
            setTimeout(this.checkFlagToBeAnything(flag), 100);
        }
    }

}
