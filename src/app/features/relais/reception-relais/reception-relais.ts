import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RelaisLayout } from '../../../shared/components/relais-layout/relais-layout';

@Component({
  selector: 'app-reception-relais',
  imports: [CommonModule, RouterModule, FormsModule, RelaisLayout],
  templateUrl: './reception-relais.html',
  styleUrl: './reception-relais.scss',
})
export class ReceptionRelais {
  codeSaisi     = '';
  colisIdentifie: any = null;
  emplacementChoisi = 'A1';

  colisAttendus = [
    { code: 'TT-DKR-4812', expediteur: 'Moussa Diop',  contenu: 'Documents',       statut: 'EN_COURS_SCAN' },
    { code: 'TT-DKR-4820', expediteur: 'Aissatou Ba',  contenu: 'Vêtements · 3kg', statut: 'EN_TRANSIT' },
    { code: 'TT-DKR-4831', expediteur: 'Ibou Niang',   contenu: 'Électronique',    statut: 'EN_TRANSIT' },
  ];

  emplacements = ['A1 — libre', 'A2 — libre', 'B1 — libre', 'B2 — libre'];

  rechercherColis() {
    if (this.codeSaisi.toUpperCase().includes('TT')) {
      this.colisIdentifie = {
        code:        this.codeSaisi.toUpperCase(),
        expediteur:  'Moussa Diop · Dakar',
        destinataire:'Cheikh Sow',
        contenu:     'Documents · 0,6 kg',
        service:     'Point relais',
      };
    }
  }

  confirmerReception() {
    // TODO : appel API PUT /api/relais/expeditions/{id}/depot
    this.colisIdentifie = null;
    this.codeSaisi = '';
  }
}
