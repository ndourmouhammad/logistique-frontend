import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationOtp } from './validation-otp';

describe('ValidationOtp', () => {
  let component: ValidationOtp;
  let fixture: ComponentFixture<ValidationOtp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationOtp],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidationOtp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
