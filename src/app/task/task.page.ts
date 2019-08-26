import {Component, OnInit} from '@angular/core';
import {HttpServiceService} from '../http-service.service';

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

    constructor(private http: HttpServiceService) {
    }

    ngOnInit() {
        this.http.getAllTask().then((data) => {
            // @ts-ignore
          this.tasks = data;
        });
    }

}
