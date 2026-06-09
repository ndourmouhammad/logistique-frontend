import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationLivraison } from './validation-livraison';

describe('ValidationLivraison', () => {
  let component: ValidationLivraison;
  let fixture: ComponentFixture<ValidationLivraison>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationLivraison],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidationLivraison);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
