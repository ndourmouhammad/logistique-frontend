import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LivreurLayout } from '../../../shared/components/livreur-layout/livreur-layout';

@Component({
  selector: 'app-dashboard-livreur',
  imports: [CommonModule, RouterModule, LivreurLayout],
  templateUrl: './dashboard-livreur.html',
  styleUrl: './dashboard-livreur.scss',
})
export class DashboardLivreur {
  nomLivreur   = 'Ibrahima Balde';
  initiales    = 'IB';
  zone         = 'Zone Dakar Nord';
  enService    = true;

  stats = { courses: 12, gains: 18500, taux: 98 };

  courses = [
    {
      code: 'DKR-4839',
      statut: 'EN_COURS_LIVRAISON',
      label: 'En cours de livraison',
      depart: 'Hub Dakar Nord',
      destination: 'Almadies, Zone 12',
      departFait: true
    },
    {
      code: 'DKR-4912',
      statut: 'RECU_AU_HUB',
      label: 'À récupérer (Hub)',
      depart: 'Hub Dakar Centre',
      destination: 'Plateau, Av. Pompidou',
      departFait: false
    }
  ];

  toggleService() {
    this.enService = !this.enService;
  }
}
