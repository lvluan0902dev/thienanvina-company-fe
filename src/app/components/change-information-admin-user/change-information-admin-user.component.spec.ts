import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeInformationAdminUserComponent } from './change-information-admin-user.component';

describe('ChangeInformationAdminUserComponent', () => {
  let component: ChangeInformationAdminUserComponent;
  let fixture: ComponentFixture<ChangeInformationAdminUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeInformationAdminUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeInformationAdminUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
