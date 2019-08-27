import {Component, OnInit} from '@angular/core';
import {HttpServiceService} from '../http-service.service';
import {PopoverController, ToastController} from '@ionic/angular';
import {PopoverCreateTaskComponent} from '../popover-create-task/popover-create-task.component';
import * as moment from 'moment';

moment.locale('de');

@Component({
    selector: 'app-task',
    templateUrl: './task.page.html',
    styleUrls: ['./task.page.scss'],
})
export class TaskPage implements OnInit {

    scheduledTasks: Array<{
        report: Array<string>,
        done: boolean,
        competent: Array<{
            image_profile: string,
            _id: string,
            name_first: string,
            name_last: string,
            email: string,
            role: string,
        }>,
        _id: string,
        title: string,
        description: string,
        dueDate: Date,
        priority: number
    }>;
    unscheduledTasks: Array<{
        report: Array<string>,
        done: boolean,
        competent: Array<{
            image_profile: string,
            _id: string,
            name_first: string,
            name_last: string,
            email: string,
            role: string,
        }>,
        _id: string,
        title: string,
        description: string,
        dueDate: Date,
        priority: number
    }>;
    doneTasks: Array<{
        report: Array<string>,
        done: boolean,
        competent: Array<{
            image_profile: string,
            _id: string,
            name_first: string,
            name_last: string,
            email: string,
            role: string,
        }>,
        _id: string,
        title: string,
        description: string,
        dueDate: Date,
        priority: number
    }>;
    showDone = false;

    constructor(private http: HttpServiceService, public toastController: ToastController,
                private popoverCtrl: PopoverController) {
    }

    ngOnInit() {
        this.loadTasks();
    }


    loadTasks() {
        this.http.getAllTask().then((data) => {
            this.scheduledTasks = data['scheduled'];
            this.unscheduledTasks = data['unscheduled'];
            this.doneTasks = data['done'];
        });
    }

    async presentNewTaskPopover(e) {
        const popover = await this.popoverCtrl.create({
            component: PopoverCreateTaskComponent,
            event: e,
            componentProps: {}
        });

        popover.onDidDismiss()
            .then(() => {
                this.loadTasks();
            });

        return await popover.present();
    }

    formatDateForView(dueDate: Date) {
        return moment(dueDate).format('DD. MMMM');
    }

    checkTask(check: boolean, task: { report: Array<string>; done: boolean; competent: Array<{ image_profile: string; _id: string; name_first: string; name_last: string; email: string; role: string }>; _id: string; title: string; description: string; dueDate: Date; priority: number }) {
        console.log('start timer');
        setTimeout(() => {
            if (task.done == check) {
                console.log('submit');
                this.http.checkTask(task._id, check).then((data) => {
                    console.log(data);
                    this.loadTasks();

                    this.toastController.create({
                        message: data['done'] ? 'Aufgabe abgeschlossen' : 'Aufgabe wiederhergestellt',
                        duration: 2000
                    }).then(toast => {
                        toast.present();
                    });
                });
            }
        }, 5000);
    }
}
