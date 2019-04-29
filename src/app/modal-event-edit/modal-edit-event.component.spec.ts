import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditEventComponent } from './modal-edit-event.component';

describe('ModalEditEventComponent', () => {
  let component: ModalEditEventComponent;
  let fixture: ComponentFixture<ModalEditEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEditEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
