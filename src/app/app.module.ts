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

@NgModule({
    declarations: [
        AppComponent,
        ModalEditGroupComponent,
        ModalEditEventComponent,
        ModalEventDetailsComponent
    ],
    entryComponents: [
        ModalEditGroupComponent, ModalEditEventComponent, ModalEventDetailsComponent
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
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
