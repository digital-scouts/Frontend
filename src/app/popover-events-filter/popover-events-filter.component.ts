import {Component, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';

@Component({
    selector: 'app-popover-events-filter',
    templateUrl: './popover-events-filter.component.html',
    styleUrls: ['./popover-events-filter.component.scss']
})
export class PopoverEventsFilterComponent {

    constructor(private popoverCtrl: PopoverController) {
    }

}
