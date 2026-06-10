import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriSelection } from './tri-selection';

describe('TriSelection', () => {
  let component: TriSelection;
  let fixture: ComponentFixture<TriSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TriSelection],
    }).compileComponents();

    fixture = TestBed.createComponent(TriSelection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
