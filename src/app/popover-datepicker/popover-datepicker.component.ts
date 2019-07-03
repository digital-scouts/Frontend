import {Component, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';

@Component({
    selector: 'app-popover-datepicker',
    templateUrl: './popover-datepicker.component.html',
    styleUrls: ['./popover-datepicker.component.scss'],
})
export class PopoverDatepickerComponent implements OnInit {

    constructor(private popoverCtrl: PopoverController) {
    }

    ngOnInit() {
    }

    dateSelected(date) {
        console.log(date);
    }

}
