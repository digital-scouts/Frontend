import {Component, OnInit} from '@angular/core';
import {HttpServiceService} from '../http-service.service';
import {PopoverController} from '@ionic/angular';
import {PopoverCreateTaskComponent} from '../popover-create-task/popover-create-task.component';

@Component({
    selector: 'app-task',
    templateUrl: './task.page.html',
    styleUrls: ['./task.page.scss'],
})
export class TaskPage implements OnInit {

    tasks: Array<{
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
    }>;

    constructor(private http: HttpServiceService,
                private popoverCtrl: PopoverController) {
    }

    ngOnInit() {
        this.loadTasks();
    }

    loadTasks() {
        this.http.getAllTask().then((data) => {
            // @ts-ignore
            this.tasks = data;
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

}
