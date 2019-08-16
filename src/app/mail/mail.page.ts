import {Component, OnInit} from '@angular/core';
import {HelperService} from '../helper.service';
import {HttpServiceService} from '../http-service.service';

@Component({
    selector: 'app-mail',
    templateUrl: './mail.page.html',
    styleUrls: ['./mail.page.scss'],
})
export class MailPage implements OnInit {

    mail: { text: string, subject: string, groups: string[] } = {text: '', subject: '', groups: []};
    allGroups = this.helper.getAllGroups();

    constructor(private helper: HelperService, private http: HttpServiceService) {
    }

    ngOnInit() {
    }

    sendMail() {
        console.log(this.mail);
        this.http.sendMail(this.mail.text, this.mail.subject, this.mail.groups).then((data) => {
            console.log(data);
        });
    }

}
