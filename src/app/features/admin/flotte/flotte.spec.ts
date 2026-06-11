import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Flotte } from './flotte';

describe('Flotte', () => {
  let component: Flotte;
  let fixture: ComponentFixture<Flotte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Flotte],
    }).compileComponents();

    fixture = TestBed.createComponent(Flotte);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
