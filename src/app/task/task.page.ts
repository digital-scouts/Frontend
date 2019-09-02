import {Component, OnInit} from '@angular/core';
import {HttpServiceService} from '../http-service.service';
import {PopoverController, ToastController} from '@ionic/angular';
import {PopoverCreateTaskComponent} from '../popover-create-task/popover-create-task.component';
import * as moment from 'moment';
import {PopoverTaskReportComponent} from '../popover-task-report/popover-task-report.component';

moment.locale('de', {
    calendar : {
        lastDay : '[Gestern]',
        sameDay : '[Heute]',
        nextDay : '[Morgen]',
        lastWeek : '[letzten] dddd',
        nextWeek : '[nächsten] dddd',
        sameElse : 'L'
    }
});

@Component({
    selector: 'app-task',
    templateUrl: './task.page.html',
    styleUrls: ['./task.page.scss'],
})
export class TaskPage implements OnInit {

    scheduledTasks: Array<{
        report: Array<{ text: string, date: Date }>,
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
        report: Array<{ text: string, date: Date }>,
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
        report: Array<{ text: string, date: Date }>,
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

    // todo
    expandViewId: string;
    showDone = false;

    constructor(private http: HttpServiceService,
                public toastController: ToastController,
                private popoverCtrl: PopoverController) {
    }

    ngOnInit() {
        this.loadTasks();
    }

    /**
     * todo offline function: store tasks in storage and load from storage
     * reload all tasks from server
     */
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

    async presentNewTaskReportPopover(e, task: { report: Array<{ text: string, date: Date }>; done: boolean; competent: Array<{ image_profile: string; _id: string; name_first: string; name_last: string; email: string; role: string }>; _id: string; title: string; description: string; dueDate: Date; priority: number }) {
        const popover = await this.popoverCtrl.create({
            component: PopoverTaskReportComponent,
            event: e,
            componentProps: {id: task._id}
        });

        popover.onDidDismiss()
            .then(() => {
                this.loadTasks();
            });

        return await popover.present();
    }

    /**
     * format the tasks for the ion-chip
     * @param dueDate
     */
    formatDateForView(dueDate: Date) {
        return moment(dueDate).calendar();
        // return moment(dueDate).format('DD. MMMM');
    }

    /**
     * calc the difference between now and the given date
     * @param date
     */
    getDateDiffToNow(date: Date) {
        return Math.round(moment.duration(moment(date).diff(moment())).asDays());
    }

    /**
     * todo offline function store check tasks in storage and update later
     * for uncheck tasks: toggle fadeout animation and remove the element after 2s when not uncheck again
     * for checked tasks: uncheck directly
     * @param check
     * @param task
     */
    checkTask(check: boolean, task: { report: Array<{ text: string, date: Date }>; done: boolean; competent: Array<{ image_profile: string; _id: string; name_first: string; name_last: string; email: string; role: string }>; _id: string; title: string; description: string; dueDate: Date; priority: number }) {
        let timeout = 2000;
        if (document.getElementById(task._id)) {
            document.getElementById(task._id).classList.toggle('removeTaskFromList');
        } else {
            timeout = 0;
        }
        setTimeout(() => {
            if (task.done === check) {
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
        }, timeout);
    }
}
