import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RelaisLayout } from '../../../shared/components/relais-layout/relais-layout';

@Component({
  selector: 'app-dashboard-relais',
  imports: [CommonModule, RouterModule, RelaisLayout],
  templateUrl: './dashboard-relais.html',
  styleUrl: './dashboard-relais.scss',
})
export class DashboardRelais {
  nomRelais = 'Boutique Awa — Thiès';

  kpis = {
    enStock:         0,
    attendusJour:    0,
    remisJour:       0,
    commissionMois: 0
  };

  colisEnStock: any[] = [];
}
