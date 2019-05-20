import {Component, OnInit} from '@angular/core';
import {NavParams, PopoverController} from '@ionic/angular';

@Component({
    selector: 'app-popover-events-filter',
    templateUrl: './popover-events-filter.component.html',
    styleUrls: ['./popover-events-filter.component.scss']
})
export class PopoverEventsFilterComponent {

    filterDateMin;
    filterDateMax;
    filterStartDate;
    filterEndDate;
    filterSelectedGroups = [true, false, false, true, false];
    filterSelectedTypes;

    constructor(private popoverCtrl: PopoverController, public navParams: NavParams) {
        this.filterDateMin = this.navParams.get('filterDateMin');
        this.filterDateMax = this.navParams.get('filterDateMax');
        this.filterStartDate = this.navParams.get('filterStartDate');
        this.filterEndDate = this.navParams.get('filterEndDate');
        this.filterSelectedGroups = this.navParams.get('filterSelectedGroups');
        this.filterSelectedTypes = this.navParams.get('filterSelectedTypes');
        console.log('popover MSG: ' + this.filterDateMax);
    }

    dismiss() {
        this.popoverCtrl.dismiss({
            filterStartDate: this.filterStartDate,
            filterEndDate: this.filterEndDate,
            groups: this.filterSelectedGroups,
            types: this.filterSelectedTypes
        });
    }

}
