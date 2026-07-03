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
    enAttente:   0,
    enTransit:   0,
    livres:      0,
    capacite:    0
  };

  alertes: any[] = [];

  expeditionsRecentes: any[] = [];
}
