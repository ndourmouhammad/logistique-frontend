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
    enStock:         8,
    attendusJour:    3,
    remisJour:       5,
    commissionMois: 12500
  };

  colisEnStock = [
    { code: 'TT-DKR-4588', destinataire: 'Omar Ndoye',    depuis: '2j',  statut: 'DISPONIBLE' },
    { code: 'TT-DKR-4590', destinataire: 'Fatou Diallo',  depuis: '1j',  statut: 'DISPONIBLE' },
    { code: 'TT-DKR-4601', destinataire: 'Ibou Niang',    depuis: '3j',  statut: 'ALERTE' },
    { code: 'TT-DKR-4612', destinataire: 'Aïda Sow',     depuis: '5j',  statut: 'ALERTE' },
  ];
}
