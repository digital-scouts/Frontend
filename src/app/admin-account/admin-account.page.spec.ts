import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccountPage } from './admin-account.page';

describe('AdminAccountPage', () => {
  let component: AdminAccountPage;
  let fixture: ComponentFixture<AdminAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAccountPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
