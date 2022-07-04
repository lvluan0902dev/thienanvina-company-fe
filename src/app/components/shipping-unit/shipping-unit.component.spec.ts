import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingUnitComponent } from './shipping-unit.component';

describe('ShippingUnitComponent', () => {
  let component: ShippingUnitComponent;
  let fixture: ComponentFixture<ShippingUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippingUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
