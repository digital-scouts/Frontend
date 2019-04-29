import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEventDetailsComponent } from './modal-event-details.component';

describe('ModalEventDetailsComponent', () => {
  let component: ModalEventDetailsComponent;
  let fixture: ComponentFixture<ModalEventDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEventDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEventDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
