import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MailPage } from './mail.page';
import {EditorModule} from '@tinymce/tinymce-angular';

const routes: Routes = [
  {
    path: '',
    component: MailPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        EditorModule
    ],
  declarations: [MailPage]
})
export class MailPageModule {}
