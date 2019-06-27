import {Component, OnInit} from '@angular/core';
import {NavParams, PopoverController} from '@ionic/angular';
import {HelperService} from '../helper.service';

@Component({
    selector: 'app-popover-events-filter',
    templateUrl: './popover-events-filter.component.html',
    styleUrls: ['./popover-events-filter.component.scss']
})
export class PopoverEventsFilterComponent {
    allGroups = this.helper.getAllGroups();
    selectedGroups: string[];
    filterDateMin;
    filterDateMax;
    filterStartDate;
    filterEndDate;
    filterSelectedTypes: { event: boolean, lesson: boolean, task: boolean };

    constructor(private popoverCtrl: PopoverController, public navParams: NavParams, private helper: HelperService) {
        this.filterDateMin = this.navParams.get('filterDateMin');
        this.filterDateMax = this.navParams.get('filterDateMax');
        this.filterStartDate = this.navParams.get('filterStartDate');
        this.filterEndDate = this.navParams.get('filterEndDate');
        this.selectedGroups = this.navParams.get('filterSelectedGroups');
        this.filterSelectedTypes = this.navParams.get('filterSelectedTypes');
        console.log(this.selectedGroups);
    }

    dismiss() {
        this.popoverCtrl.dismiss({
            filterStartDate: this.filterStartDate,
            filterEndDate: this.filterEndDate,
            groups: this.selectedGroups,
            types: this.filterSelectedTypes
        });
    }

}
