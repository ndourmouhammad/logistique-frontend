import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilRelais } from './profil-relais';

describe('ProfilRelais', () => {
  let component: ProfilRelais;
  let fixture: ComponentFixture<ProfilRelais>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilRelais],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilRelais);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
