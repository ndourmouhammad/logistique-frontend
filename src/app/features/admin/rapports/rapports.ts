import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminLayout } from '../../../shared/components/admin-layout/admin-layout';

@Component({
  selector: 'app-rapports',
  imports: [CommonModule, RouterModule, FormsModule, AdminLayout],
  templateUrl: './rapports.html',
  styleUrl: './rapports.scss',
})
export class Rapports {
  today = new Date();
  periodeFiltree = signal('mois');
  ongletActif    = 'financier';

  kpis = {
    caMois:        2850000,
    expeditions:   1247,
    tauxSucces:    94.2,
    tempsLivraison: 4.8
  };

  donneesGraphique = [
    { jour: 'L', valeur: 35 },
    { jour: 'M', valeur: 52 },
    { jour: 'M', valeur: 48 },
    { jour: 'J', valeur: 61 },
    { jour: 'V', valeur: 78 },
    { jour: 'S', valeur: 89 },
    { jour: 'D', valeur: 42 },
  ];

  get maxValeur(): number {
    return Math.max(...this.donneesGraphique.map(d => d.valeur));
  }

  exporter(format: string) {

    // TODO : appel API export
  }
}
