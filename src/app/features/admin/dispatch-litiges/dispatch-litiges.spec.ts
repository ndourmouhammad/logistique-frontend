import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchLitiges } from './dispatch-litiges';

describe('DispatchLitiges', () => {
  let component: DispatchLitiges;
  let fixture: ComponentFixture<DispatchLitiges>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispatchLitiges],
    }).compileComponents();

    fixture = TestBed.createComponent(DispatchLitiges);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
