import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HubLayout } from '../../../shared/components/hub-layout/hub-layout';

@Component({
  selector: 'app-preparation-expedition',
  imports: [HubLayout, CommonModule, RouterModule],
  templateUrl: './preparation-expedition.html',
  styleUrl: './preparation-expedition.scss',
})
export class PreparationExpedition {
  livreurSelectionne = 'IB';

  colisSelectionnes = [
    { code: 'TT-DKR-4839', destination: 'Almadies', type: 'Express' },
    { code: 'TT-DKR-4901', destination: 'Point E',  type: 'Express' },
    { code: 'TT-DKR-4720', destination: 'Médina',   type: 'Standard' },
    { code: 'TT-DKR-4698', destination: 'HLM',      type: 'Standard' },
  ];

  livreurs = [
    { initiales: 'IB', nom: 'Ibrahima Balde',  vehicule: 'Moto',   zone: 'Dakar',       note: 4.8, courses: 156, taux: 98,  tempsMoyen: 22, statut: 'DISPONIBLE', distance: 1.2, selectionne: true },
    { initiales: 'AS', nom: 'Amadou Sow',       vehicule: 'Moto',   zone: 'Dakar',       note: 4.6, courses: 98,  taux: 95,  tempsMoyen: 28, statut: 'DISPONIBLE', distance: 2.8, selectionne: false },
    { initiales: 'MK', nom: 'Moussa Keita',     vehicule: 'Camion', zone: 'Inter-Hub',   note: 4.9, courses: 210, taux: 99,  tempsMoyen: 45, statut: 'EN_COURS',   distance: 4.1, selectionne: false },
  ];

  constructor(private router: Router) {}

  selectionnerLivreur(initiales: string) {
    this.livreurs.forEach(l => l.selectionne = l.initiales === initiales);
    this.livreurSelectionne = initiales;
  }

  confirmerAffectation() {
    this.router.navigate(['/hub/validation-depart']);
  }
}
