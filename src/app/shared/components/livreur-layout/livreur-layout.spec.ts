import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivreurLayout } from './livreur-layout';

describe('LivreurLayout', () => {
  let component: LivreurLayout;
  let fixture: ComponentFixture<LivreurLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivreurLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(LivreurLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
