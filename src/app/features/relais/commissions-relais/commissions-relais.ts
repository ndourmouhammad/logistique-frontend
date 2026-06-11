import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RelaisLayout } from '../../../shared/components/relais-layout/relais-layout';

@Component({
  selector: 'app-commissions-relais',
  imports: [CommonModule, RouterModule, FormsModule, RelaisLayout],
  templateUrl: './commissions-relais.html',
  styleUrl: './commissions-relais.scss',
})
export class CommissionsRelais {
  periodeFiltree = 'mois';

  kpis = {
    commissionMois:      12500,
    commissionDisponible: 8200,
    nbRemises:              47,
    tauxCommission:       0.05
  };

  transactions = [
    { code: 'TT-DKR-4588', destinataire: 'Omar Ndoye',   date: "Auj. 10h15", commission: 250, statut: 'PAYE' },
    { code: 'TT-DKR-4520', destinataire: 'Fatou Diallo', date: 'Hier 14h30', commission: 250, statut: 'PAYE' },
    { code: 'TT-DKR-4490', destinataire: 'Ibou Niang',   date: '08/06',      commission: 250, statut: 'PAYE' },
    { code: 'TT-DKR-4401', destinataire: 'Aïda Sow',    date: '05/06',      commission: 250, statut: 'EN_ATTENTE' },
  ];

  demanderVirement() {
    console.log('Demande virement', this.kpis.commissionDisponible);
    // TODO : appel API
  }
}
