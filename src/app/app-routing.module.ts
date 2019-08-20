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
  { path: 'mail', loadChildren: './mail/mail.module#MailPageModule' },
  { path: 'logout', loadChildren: './logout/logout.module#LogoutPageModule' },
  { path: 'own-account', loadChildren: './own-account/own-account.module#OwnAccountPageModule' },
  { path: 'group-management', loadChildren: './group-management/group-management.module#GroupManagementPageModule' },
  { path: 'group-planning', loadChildren: './group-planning/group-planning.module#GroupPlanningPageModule' },
  { path: 'task', loadChildren: './task/task.module#TaskPageModule' },



];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
