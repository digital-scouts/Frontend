import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverEventDetailsComponent } from './popover-event-details.component';

describe('PopoverEventDetailsComponent', () => {
  let component: PopoverEventDetailsComponent;
  let fixture: ComponentFixture<PopoverEventDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverEventDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverEventDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
