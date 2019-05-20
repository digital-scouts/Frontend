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
    // warning when this will be updated, than update also the calendar.page
    allGroups: Array<{
        id: string,
        color: string,
        name: string,
        isChildGroup: boolean,
        selected: boolean
    }> = [];
    filterSelectedTypes;
    testcolor = '#bf5757';

    constructor(private popoverCtrl: PopoverController, public navParams: NavParams) {
        this.filterDateMin = this.navParams.get('filterDateMin');
        this.filterDateMax = this.navParams.get('filterDateMax');
        this.filterStartDate = this.navParams.get('filterStartDate');
        this.filterEndDate = this.navParams.get('filterEndDate');
        this.allGroups = this.navParams.get('filterSelectedGroups');
        this.filterSelectedTypes = this.navParams.get('filterSelectedTypes');
    }

    // todo erstelle checkboxen für gruppen

    dismiss() {
        this.popoverCtrl.dismiss({
            filterStartDate: this.filterStartDate,
            filterEndDate: this.filterEndDate,
            groups: this.allGroups,
            types: this.filterSelectedTypes
        });
    }

}
