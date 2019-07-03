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
import {ModalEventDetailsComponent} from './modal-event-details/modal-event-details.component';
import {PopoverEventsFilterComponent} from './popover-events-filter/popover-events-filter.component';
import {PopoverController} from 'ionic-angular/components/popover/popover-controller';
import {ModalAdminUserDetailsComponent} from './modal-admin-user-details/modal-admin-user-details.component';
import {PopoverDatepickerComponent} from './popover-datepicker/popover-datepicker.component';
import {Ionic4DatepickerModule} from '@logisticinfotech/ionic4-datepicker';


@NgModule({
    declarations: [
        AppComponent,
        ModalEditGroupComponent,
        ModalEditEventComponent,
        ModalEventDetailsComponent,
        ModalAdminUserDetailsComponent,
        PopoverEventsFilterComponent,
        PopoverDatepickerComponent
    ],
    entryComponents: [
        ModalEditGroupComponent,
        ModalEditEventComponent,
        ModalEventDetailsComponent,
        ModalAdminUserDetailsComponent,
        PopoverEventsFilterComponent,
        PopoverDatepickerComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        IonicModule.forRoot(),
        IonicStorageModule.forRoot(),
        AppRoutingModule,
    ],
    providers: [
        HTTP,
        StatusBar,
        SplashScreen,
        PopoverController,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
