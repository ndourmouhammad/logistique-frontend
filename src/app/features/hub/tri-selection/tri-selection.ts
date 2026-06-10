import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HubLayout } from '../../../shared/components/hub-layout/hub-layout';

@Component({
  selector: 'app-tri-selection',
  imports: [HubLayout, CommonModule, RouterModule, FormsModule],
  templateUrl: './tri-selection.html',
  styleUrl: './tri-selection.scss',
})
export class TriSelection {
  filtreDestination = 'tous';
  colisSelectionnes: string[] = [];

  colis = [
    { code: 'TT-DKR-4839', destination: 'Almadies',  zone: 'Dakar Nord',   type: 'Express',  poids: 2.5 },
    { code: 'TT-DKR-4901', destination: 'Point E',   zone: 'Dakar Centre', type: 'Express',  poids: 1.0 },
    { code: 'TT-DKR-4720', destination: 'Médina',    zone: 'Dakar Centre', type: 'Standard', poids: 3.2 },
    { code: 'TT-DKR-4698', destination: 'HLM',       zone: 'Dakar Sud',    type: 'Standard', poids: 0.8 },
    { code: 'TT-DKR-4512', destination: 'Thiès',     zone: 'Inter-Hub',    type: 'Standard', poids: 5.0 },
  ];

  constructor(private router: Router) {}

  toggleSelection(code: string) {
    const idx = this.colisSelectionnes.indexOf(code);
    if (idx === -1) this.colisSelectionnes.push(code);
    else this.colisSelectionnes.splice(idx, 1);
  }

  estSelectionne(code: string): boolean {
    return this.colisSelectionnes.includes(code);
  }

  suivant() {
    this.router.navigate(['/hub/preparation']);
  }
}
