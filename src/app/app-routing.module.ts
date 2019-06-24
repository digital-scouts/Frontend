import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', loadChildren: './home/home.module#HomePageModule'},
    {path: 'registration', loadChildren: './registration/registration.module#RegistrationPageModule'},
    {path: 'calendar', loadChildren: './calendar/calendar.module#CalendarPageModule'},
    {path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule'},
    {path: 'help', loadChildren: './help/help.module#HelpPageModule'},
    {path: 'chat', loadChildren: './chat/chat.module#ChatPageModule'},  { path: 'admin-account', loadChildren: './admin-account/admin-account.module#AdminAccountPageModule' },



];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
