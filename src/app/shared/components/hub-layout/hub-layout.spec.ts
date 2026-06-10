import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HubLayout } from './hub-layout';

describe('HubLayout', () => {
  let component: HubLayout;
  let fixture: ComponentFixture<HubLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HubLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(HubLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
