import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HubLayout } from '../../../shared/components/hub-layout/hub-layout';


@Component({
  selector: 'app-dashboard-hub',
  imports: [HubLayout, CommonModule, RouterModule],
  templateUrl: './dashboard-hub.html',
  styleUrl: './dashboard-hub.scss',
})
export class DashboardHub {
  nomHub       = 'Hub Dakar Nord';
  gestionnaire = 'GH';

  kpis = {
    enAttente:   14,
    enTransit:    8,
    livres:      47,
    capacite:    78
  };

  alertes = [
    { type: 'warning', message: '3 colis en attente depuis +24h',    icon: 'ti-clock' },
    { type: 'info',    message: 'Camion DK-1234 prévu à 14h30',      icon: 'ti-truck' },
    { type: 'success', message: '12 colis reçus ce matin',           icon: 'ti-package' },
  ];

  expeditionsRecentes = [
    { code: 'TT-DKR-4839', destination: 'Almadies',    statut: 'EN_COURS_LIVRAISON', livreur: 'Ibrahima B.' },
    { code: 'TT-DKR-4721', destination: 'Thiès',       statut: 'EN_TRANSIT',         livreur: 'Camion DK-1234' },
    { code: 'TT-DKR-4698', destination: 'Point E',     statut: 'RECU_AU_HUB',        livreur: '—' },
    { code: 'TT-DKR-4512', destination: 'Saint-Louis', statut: 'EN_TRANSIT',         livreur: 'Camion DK-5678' },
  ];
}
