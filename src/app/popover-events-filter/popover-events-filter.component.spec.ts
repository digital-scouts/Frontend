import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverEventsFilterComponent } from './popover-events-filter.component';

describe('PopoverEventsFilterComponent', () => {
  let component: PopoverEventsFilterComponent;
  let fixture: ComponentFixture<PopoverEventsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverEventsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverEventsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
