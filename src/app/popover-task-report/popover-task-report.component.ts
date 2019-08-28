import {Component, OnInit} from '@angular/core';
import {NavParams, PopoverController} from '@ionic/angular';
import {HttpServiceService} from '../http-service.service';

@Component({
    selector: 'app-popover-task-report',
    templateUrl: './popover-task-report.component.html',
    styleUrls: ['./popover-task-report.component.scss'],
})
export class PopoverTaskReportComponent implements OnInit {
    reportText: string;
    id: string;

    constructor(
        private popoverCtrl: PopoverController,
        private http: HttpServiceService,
        public navParams: NavParams
    ) {
        this.id = this.navParams.get('id');
        console.log(this.id)
    }

    ngOnInit() {
    }

    dismiss() {
        this.popoverCtrl.dismiss({});
    }

    submitReport() {
        this.http.addReportToTask(this.id, this.reportText).then(data => {
            this.dismiss()
        });
    }
}
