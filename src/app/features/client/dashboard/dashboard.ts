import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, ClientLayout],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  nomUtilisateur = 'Moussa';
  dateAujourdhui = new Date();

  expeditions = [
    { code: 'TT-DKR-4839', destination: 'Saint-Louis', date: "Aujourd'hui", statut: 'EN_COURS' },
    { code: 'TT-DKR-4721', destination: 'Thiès',       date: '04 mai',      statut: 'LIVRE' },
    { code: 'TT-DKR-4698', destination: 'Ziguinchor',  date: '02 mai',      statut: 'CREE' },
  ];

  getStatutClass(statut: string): string {
    const classes: Record<string, string> = {
      'EN_COURS': 'bg-orange-50 text-tt-orange',
      'LIVRE':    'bg-emerald-50 text-emerald-600',
      'CREE':     'bg-purple-50 text-purple-600',
    };
    return classes[statut] || 'bg-slate-50 text-slate-500';
  }

  getStatutLabel(statut: string): string {
    const labels: Record<string, string> = {
      'EN_COURS': 'En cours',
      'LIVRE':    'Livrée',
      'CREE':     'Planifiée',
    };
    return labels[statut] || statut;
  }

  getStatutIcon(statut: string): string {
    const icons: Record<string, string> = {
      'EN_COURS': 'ti-truck',
      'LIVRE':    'ti-check',
      'CREE':     'ti-package',
    };
    return icons[statut] || 'ti-package';
  }
}
