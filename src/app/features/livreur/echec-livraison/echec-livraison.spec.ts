import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EchecLivraison } from './echec-livraison';

describe('EchecLivraison', () => {
  let component: EchecLivraison;
  let fixture: ComponentFixture<EchecLivraison>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EchecLivraison],
    }).compileComponents();

    fixture = TestBed.createComponent(EchecLivraison);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
