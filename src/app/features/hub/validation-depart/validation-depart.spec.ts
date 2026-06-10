import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationDepart } from './validation-depart';

describe('ValidationDepart', () => {
  let component: ValidationDepart;
  let fixture: ComponentFixture<ValidationDepart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationDepart],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidationDepart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
