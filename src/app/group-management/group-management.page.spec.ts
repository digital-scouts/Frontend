import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupManagementPage } from './group-management.page';

describe('GroupManagementPage', () => {
  let component: GroupManagementPage;
  let fixture: ComponentFixture<GroupManagementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupManagementPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
