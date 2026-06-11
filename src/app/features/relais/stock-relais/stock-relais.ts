import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RelaisLayout } from '../../../shared/components/relais-layout/relais-layout';

@Component({
  selector: 'app-stock-relais',
  imports: [CommonModule, RouterModule, FormsModule, RelaisLayout],
  templateUrl: './stock-relais.html',
  styleUrl: './stock-relais.scss',
})
export class StockRelais {
  recherche    = '';
  filtreStatut = 'tous';

  colis = [
    { code: 'TT-DKR-4588', destinataire: 'Omar Ndoye',   tel: '+221 76 122 88 99', contenu: 'Documents',       emplacement: 'A1', depuis: '2j',  statut: 'DISPONIBLE' },
    { code: 'TT-DKR-4590', destinataire: 'Fatou Diallo', tel: '+221 77 845 12 34', contenu: 'Vêtements',       emplacement: 'A2', depuis: '1j',  statut: 'DISPONIBLE' },
    { code: 'TT-DKR-4601', destinataire: 'Ibou Niang',   tel: '+221 78 234 56 78', contenu: 'Électronique',    emplacement: 'B1', depuis: '3j',  statut: 'ALERTE' },
    { code: 'TT-DKR-4612', destinataire: 'Aïda Sow',    tel: '+221 70 987 65 43', contenu: 'Chaussures',      emplacement: 'B2', depuis: '5j',  statut: 'ALERTE' },
    { code: 'TT-DKR-4623', destinataire: 'Cheikh Fall',  tel: '+221 76 543 21 09', contenu: 'Livres',          emplacement: 'C1', depuis: '1j',  statut: 'DISPONIBLE' },
  ];

  get colisFiltres() {
    return this.colis.filter(c => {
      const matchRecherche = c.code.toLowerCase().includes(this.recherche.toLowerCase())
        || c.destinataire.toLowerCase().includes(this.recherche.toLowerCase());
      const matchStatut = this.filtreStatut === 'tous' || c.statut === this.filtreStatut;
      return matchRecherche && matchStatut;
    });
  }

  envoyerRappel(code: string) {
    console.log('Rappel SMS pour', code);
    // TODO : appel API notification
  }
}
