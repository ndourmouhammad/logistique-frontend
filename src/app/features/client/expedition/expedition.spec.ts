import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Expedition } from './expedition';

describe('Expedition', () => {
  let component: Expedition;
  let fixture: ComponentFixture<Expedition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Expedition],
    }).compileComponents();

    fixture = TestBed.createComponent(Expedition);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
