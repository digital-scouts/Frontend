import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupPlanningPage } from './group-planning.page';

describe('GroupPlanningPage', () => {
  let component: GroupPlanningPage;
  let fixture: ComponentFixture<GroupPlanningPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupPlanningPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupPlanningPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
