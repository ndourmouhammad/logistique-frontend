import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HubLayout } from '../../../shared/components/hub-layout/hub-layout';

@Component({
  selector: 'app-plan-hub',
  imports: [HubLayout, CommonModule, RouterModule],
  templateUrl: './plan-hub.html',
  styleUrl: './plan-hub.scss',
})
export class PlanHub {
  capaciteTotale  = 500;
  colisStockes    = 89;

  get tauxOccupation(): number {
    return Math.round((this.colisStockes / this.capaciteTotale) * 100);
  }

  zones = [
    { code: 'A', nom: 'Zone A — Express',    nbColis: 24, capacite: 80,  couleur: 'bg-indigo-500' },
    { code: 'B', nom: 'Zone B — Standard',   nbColis: 41, capacite: 150, couleur: 'bg-emerald-500' },
    { code: 'C', nom: 'Zone C — Fragile',    nbColis: 12, capacite: 50,  couleur: 'bg-orange-500' },
    { code: 'D', nom: 'Zone D — Inter-Hub',  nbColis: 12, capacite: 100, couleur: 'bg-purple-500' },
  ];
}
