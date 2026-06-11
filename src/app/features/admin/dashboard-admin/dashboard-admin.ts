import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminLayout } from '../../../shared/components/admin-layout/admin-layout';

@Component({
  selector: 'app-dashboard-admin',
  imports: [CommonModule, RouterModule, AdminLayout],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.scss',
})
export class DashboardAdmin {
  kpis = {
    caJour:         485000,
    expeditions:    127,
    livreesJour:     89,
    tauxSucces:      94,
    livreurs:        23,
    incidents:        2,
  };

  expeditionsRecentes = [
    { code: 'TT-DKR-4839', client: 'Moussa D.',  destination: 'Almadies',    statut: 'EN_COURS_LIVRAISON', livreur: 'Ibrahima B.' },
    { code: 'TT-DKR-4721', client: 'Fatou N.',   destination: 'Thiès',       statut: 'EN_TRANSIT',         livreur: 'Camion DK-1234' },
    { code: 'TT-DKR-4698', client: 'Omar B.',    destination: 'Ziguinchor',  statut: 'RECU_AU_HUB',        livreur: '—' },
    { code: 'TT-DKR-4512', client: 'Aïda S.',   destination: 'Saint-Louis', statut: 'LIVRE',              livreur: 'Amadou S.' },
    { code: 'TT-DKR-4401', client: 'Cheikh F.',  destination: 'Kaolack',     statut: 'EN_LITIGE',          livreur: 'Moussa K.' },
  ];

  getStatutClass(statut: string): string {
    const map: Record<string, string> = {
      'EN_COURS_LIVRAISON': 'bg-orange-50 text-orange-700',
      'EN_TRANSIT':         'bg-blue-50 text-blue-700',
      'RECU_AU_HUB':        'bg-purple-50 text-purple-700',
      'LIVRE':              'bg-emerald-50 text-emerald-700',
      'EN_LITIGE':          'bg-red-50 text-red-700',
    };
    return map[statut] || 'bg-slate-50 text-slate-500';
  }

  getStatutLabel(statut: string): string {
    const map: Record<string, string> = {
      'EN_COURS_LIVRAISON': 'En livraison',
      'EN_TRANSIT':         'En transit',
      'RECU_AU_HUB':        'Au hub',
      'LIVRE':              'Livré',
      'EN_LITIGE':          'En litige',
    };
    return map[statut] || statut;
  }
}
