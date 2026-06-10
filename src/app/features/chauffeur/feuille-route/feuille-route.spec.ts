import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeuilleRoute } from './feuille-route';

describe('FeuilleRoute', () => {
  let component: FeuilleRoute;
  let fixture: ComponentFixture<FeuilleRoute>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeuilleRoute],
    }).compileComponents();

    fixture = TestBed.createComponent(FeuilleRoute);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
