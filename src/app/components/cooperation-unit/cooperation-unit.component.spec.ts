import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CooperationUnitComponent } from './cooperation-unit.component';

describe('CooperationUnitComponent', () => {
  let component: CooperationUnitComponent;
  let fixture: ComponentFixture<CooperationUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CooperationUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CooperationUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
