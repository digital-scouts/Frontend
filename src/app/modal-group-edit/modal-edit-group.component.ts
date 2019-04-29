import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {HttpServiceService} from '../http-service.service';

@Component({
  selector: 'app-modal-edit-group',
  templateUrl: './modal-edit-group.component.html',
  styleUrls: ['./modal-edit-group.component.scss']
})
export class ModalEditGroupComponent implements OnInit {


  // id of group to edit, if id null than create a new Group
  @Input() id: string;

  constructor(
      private modal: ModalController,
      private http: HttpServiceService
  ) {
  }

  ngOnInit() {
  }

  closeModal() {
    this.modal.dismiss();
  }

}
