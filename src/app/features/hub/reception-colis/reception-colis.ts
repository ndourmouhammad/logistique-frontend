import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HubLayout } from '../../../shared/components/hub-layout/hub-layout';

@Component({
  selector: 'app-reception-colis',
  imports: [HubLayout, FormsModule, CommonModule, RouterModule],
  templateUrl: './reception-colis.html',
  styleUrl: './reception-colis.scss',
})
export class ReceptionColis {
  recherche    = '';
  filtreType   = 'tous';
  scanReussi   = false;
  codeSaisi    = '';

  colisEnAttente = [
    { code: 'TT-DKR-4839', expediteur: 'Moussa D.',  destination: 'Almadies',  poids: 2.5, type: 'LIVREUR',  heure: '14:32' },
    { code: 'TT-DKR-4840', expediteur: 'Fatou N.',   destination: 'Yoff',      poids: 1.2, type: 'LIVREUR',  heure: '15:10' },
    { code: 'TT-DKR-4841', expediteur: 'Camion DK',  destination: 'Thiès',     poids: 8.0, type: 'CAMION',   heure: '09:00' },
    { code: 'TT-DKR-4842', expediteur: 'Omar B.',    destination: 'Plateau',   poids: 0.8, type: 'LIVREUR',  heure: '16:05' },
  ];

  get colisFiltres() {
    return this.colisEnAttente.filter(c => {
      const matchRecherche = c.code.toLowerCase().includes(this.recherche.toLowerCase())
        || c.destination.toLowerCase().includes(this.recherche.toLowerCase());
      const matchType = this.filtreType === 'tous' || c.type === this.filtreType;
      return matchRecherche && matchType;
    });
  }

  receptionnerColis(code: string) {
    console.log('Réceptionner', code);
    // TODO : appel API PUT /api/hub/expeditions/{id}/reception
  }
}
