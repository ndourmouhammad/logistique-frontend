import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';

@Component({
  selector: 'app-historique',
  imports: [CommonModule, RouterModule, FormsModule, ClientLayout],
  templateUrl: './historique.html',
  styleUrl: './historique.scss',
})
export class Historique {
  recherche   = '';
  filtreStatut = 'tous';

  expeditions = [
    { code: 'TT-DKR-4839', destination: 'Saint-Louis', date: "Auj.",   statut: 'EN_COURS',  montant: 3600 },
    { code: 'TT-DKR-4721', destination: 'Thiès',       date: '04 mai', statut: 'LIVRE',     montant: 2800 },
    { code: 'TT-DKR-4698', destination: 'Ziguinchor',  date: '02 mai', statut: 'CREE',      montant: 4200 },
    { code: 'TT-DKR-4512', destination: 'Kaolack',     date: '28 avr', statut: 'LIVRE',     montant: 1900 },
    { code: 'TT-DKR-4401', destination: 'Mbour',       date: '22 avr', statut: 'RETOURNE',  montant: 2100 },
  ];

  get expeditionsFiltrees() {
    return this.expeditions.filter(e => {
      const matchRecherche = e.code.toLowerCase().includes(this.recherche.toLowerCase())
        || e.destination.toLowerCase().includes(this.recherche.toLowerCase());
      const matchStatut = this.filtreStatut === 'tous' || e.statut === this.filtreStatut;
      return matchRecherche && matchStatut;
    });
  }
}
