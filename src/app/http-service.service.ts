import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as CONFIG from '../../config_app.json';

@Injectable({
    providedIn: 'root'
})
export class HttpServiceService {
    private backend_url;

    constructor(
        private http: HttpClient
    ) {
        this.backend_url = CONFIG.default.url;
    }


    auth(data) {
        return new Promise(resolve => {
            this.http.post(this.backend_url + '/auth', JSON.stringify(data)).subscribe(res => {
                resolve(res);
            }, err => {
                console.log(err);
            });
        });
    }
}
