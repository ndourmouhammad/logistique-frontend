import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationTransfert } from './validation-transfert';

describe('ValidationTransfert', () => {
  let component: ValidationTransfert;
  let fixture: ComponentFixture<ValidationTransfert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationTransfert],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidationTransfert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
