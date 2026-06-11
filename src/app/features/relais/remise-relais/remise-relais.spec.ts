import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemiseRelais } from './remise-relais';

describe('RemiseRelais', () => {
  let component: RemiseRelais;
  let fixture: ComponentFixture<RemiseRelais>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemiseRelais],
    }).compileComponents();

    fixture = TestBed.createComponent(RemiseRelais);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
