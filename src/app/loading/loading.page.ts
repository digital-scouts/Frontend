import {Component, OnInit} from '@angular/core';
import {LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';

import * as config from '../../config_app.json';

const url = config.backend_url;

@Component({
    selector: 'app-loading',
    templateUrl: './loading.page.html',
    styleUrls: ['./loading.page.scss'],
})
export class LoadingPage implements OnInit {
    loadingElement;

    constructor(private router: Router, public loadingController: LoadingController) {
    }

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
            this.closeLoadingPage();
        } else {
            this.goToLogin();
        }
        this.dismissLoading();
    }

    /**
     * @todo make a own loadingscreen animation
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
     * @todo
     * Check if someone already is logged in
     * @returns boolean
     */
    private isLoggedIn() {
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
    private closeLoadingPage() {
        this.router.navigate(['/home']);
    }

    /**
     * navigate to LoginPage
     */
    private goToLogin() {
        this.router.navigate(['/login']);
    }

}
