import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LivreurLayout } from '../../../shared/components/livreur-layout/livreur-layout';
import { LivreurService } from '../../../core/services/livreur';
import { Auth } from '../../../core/services/auth';
import { LivreurStats } from '../../../core/models/relais.model';

@Component({
  selector: 'app-historique-gains',
  imports: [CommonModule, RouterModule, LivreurLayout],
  templateUrl: './historique-gains.html',
  styleUrl: './historique-gains.scss',
})
export class HistoriqueGains implements OnInit {
  ongletActif = 'livraisons';
  dateDuMois = '';

  stats = signal<LivreurStats>({ coursesLivrees: 0, gainsTotal: 0, tauxReussite: 0 });
  isLoadingStats = signal(true);
  livraisons = signal<any[]>([]);
  isLoadingLivraisons = signal(true);

  private livreurService = inject(LivreurService);
  private authService    = inject(Auth);

  ngOnInit() {
    const mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const d = new Date();
    this.dateDuMois = `${mois[d.getMonth()]} ${d.getFullYear()}`;

    const livreurId = this.authService.getUserId();
    if (livreurId) {
      this.livreurService.getStats(livreurId).subscribe({
        next: (data) => {
          this.stats.set(data);
          this.isLoadingStats.set(false);
        },
        error: () => this.isLoadingStats.set(false)
      });
      
      this.livreurService.getHistorique(livreurId).subscribe({
        next: (data) => {
          this.livraisons.set(data);
          this.isLoadingLivraisons.set(false);
        },
        error: () => this.isLoadingLivraisons.set(false)
      });
    }
  }

  switchOnglet(onglet: string) {
    this.ongletActif = onglet;
  }
}
