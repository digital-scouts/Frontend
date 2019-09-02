import {Component, OnInit} from '@angular/core';
import {NavParams, PopoverController, ToastController} from '@ionic/angular';
import * as moment from 'moment';
import {HelperService} from '../helper.service';
import {HttpServiceService} from '../http-service.service';

@Component({
    selector: 'app-popover-create-task',
    templateUrl: './popover-create-task.component.html',
    styleUrls: ['./popover-create-task.component.scss'],
})
export class PopoverCreateTaskComponent implements OnInit {

    datePickerObj = this.helper.datePickerObj;
    datePickerDate = '';
    taskTitle;
    taskDescription;
    taskPriority = 3;

    constructor(
        private popoverCtrl: PopoverController,
        private http: HttpServiceService, public toastController: ToastController,
        private helper: HelperService
    ) {
        this.datePickerObj.clearButton = true;
        this.datePickerObj['fromDate'] = moment();
    }

    ngOnInit() {
    }

    save() {
        console.log(this.datePickerDate)
        this.http.createNewTask(this.taskTitle, this.taskDescription, this.datePickerDate ? moment(HelperService.getDateToISO(this.datePickerDate)).toDate() : null, this.taskPriority).then((data) => {
            if (data && data['_id']) {
                this.toastController.create({
                    message: 'Aufgabe erstellt.',
                    duration: 2000
                }).then(toast => {
                    toast.present();
                });
                this.dismiss();
            }
        });
    }

    dismiss() {
        this.popoverCtrl.dismiss({});
    }

}
