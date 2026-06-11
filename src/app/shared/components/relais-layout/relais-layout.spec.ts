import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelaisLayout } from './relais-layout';

describe('RelaisLayout', () => {
  let component: RelaisLayout;
  let fixture: ComponentFixture<RelaisLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelaisLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(RelaisLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
