import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminLayout } from '../../../shared/components/admin-layout/admin-layout';

@Component({
  selector: 'app-dispatch-litiges',
  imports: [CommonModule, RouterModule, FormsModule, AdminLayout],
  templateUrl: './dispatch-litiges.html',
  styleUrl: './dispatch-litiges.scss',
})
export class DispatchLitiges {
  ongletActif = 'dispatch';

  expeditionsNonAssignees = [
    { code: 'TT-DKR-4698', destination: 'Ziguinchor', poids: 5.0, depuis: '2h30', priorite: 'HAUTE' },
    { code: 'TT-DKR-4512', destination: 'Kaolack',    poids: 2.1, depuis: '1h15', priorite: 'NORMALE' },
    { code: 'TT-DKR-4401', destination: 'Thiès',      poids: 0.8, depuis: '45min', priorite: 'NORMALE' },
  ];

  litiges = [
    { code: 'TT-DKR-4320', type: 'COLIS_ENDOMMAGE',  client: 'Moussa D.',  date: '08/06',  statut: 'OUVERT',    montant: 15000 },
    { code: 'TT-DKR-4210', type: 'COLIS_PERDU',      client: 'Fatou N.',   date: '05/06',  statut: 'EN_COURS',  montant: 35000 },
    { code: 'TT-DKR-4105', type: 'RETARD',           client: 'Omar B.',    date: '02/06',  statut: 'RESOLU',    montant: 0 },
  ];

  getLitigeTypeLabel(type: string): string {
    const map: Record<string, string> = {
      'COLIS_ENDOMMAGE': 'Colis endommagé',
      'COLIS_PERDU':     'Colis perdu',
      'RETARD':          'Retard livraison',
    };
    return map[type] || type;
  }
}
