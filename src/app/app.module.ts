import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {IonicStorageModule} from '@ionic/storage';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HTTP} from '@ionic-native/http/ngx';
import {FormsModule} from '@angular/forms';
import {ModalEditGroupComponent} from './modal-group-edit/modal-edit-group.component';
import {ModalEditEventComponent} from './modal-event-edit/modal-edit-event.component';
import {PopoverEventDetailsComponent} from './popover-event-details/popover-event-details.component';
import {PopoverEventsFilterComponent} from './popover-events-filter/popover-events-filter.component';
import {PopoverController} from 'ionic-angular/components/popover/popover-controller';
import {ModalAdminUserDetailsComponent} from './modal-admin-user-details/modal-admin-user-details.component';
import {Ionic4DatepickerModule} from '@logisticinfotech/ionic4-datepicker';
import {CallNumber} from '@ionic-native/call-number/ngx';
import {PopoverCreateTaskComponent} from './popover-create-task/popover-create-task.component';
import {PopoverTaskReportComponent} from './popover-task-report/popover-task-report.component';
import {ModalGroupManagementUserDetailsComponent} from './modal-group-management-user-details/modal-group-management-user-details.component';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


@NgModule({
    declarations: [
        AppComponent,
        ModalEditGroupComponent,
        ModalEditEventComponent,
        PopoverEventDetailsComponent,
        ModalAdminUserDetailsComponent,
        ModalGroupManagementUserDetailsComponent,
        PopoverEventsFilterComponent,
        PopoverCreateTaskComponent,
        PopoverTaskReportComponent
    ],
    entryComponents: [
        ModalEditGroupComponent,
        ModalEditEventComponent,
        PopoverEventDetailsComponent,
        ModalAdminUserDetailsComponent,
        ModalGroupManagementUserDetailsComponent,
        PopoverEventsFilterComponent,
        PopoverCreateTaskComponent,
        PopoverTaskReportComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        IonicModule.forRoot(),
        IonicStorageModule.forRoot(),
        AppRoutingModule,
        Ionic4DatepickerModule
    ],
    providers: [
        HTTP,
        StatusBar,
        SplashScreen,
        PopoverController,
        CallNumber,
        InAppBrowser,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
