import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparationExpedition } from './preparation-expedition';

describe('PreparationExpedition', () => {
  let component: PreparationExpedition;
  let fixture: ComponentFixture<PreparationExpedition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreparationExpedition],
    }).compileComponents();

    fixture = TestBed.createComponent(PreparationExpedition);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
