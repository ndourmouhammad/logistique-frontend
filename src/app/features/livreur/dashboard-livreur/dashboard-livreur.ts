import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LivreurLayout } from '../../../shared/components/livreur-layout/livreur-layout';
import { LivreurService } from '../../../core/services/livreur';
import { Auth } from '../../../core/services/auth';
import { ExpeditionListItem } from '../../../core/models/relais.model';

@Component({
  selector: 'app-dashboard-livreur',
  imports: [CommonModule, RouterModule, LivreurLayout],
  templateUrl: './dashboard-livreur.html',
  styleUrl: './dashboard-livreur.scss',
})
export class DashboardLivreur implements OnInit {

  nomLivreur = signal('');
  initiales  = signal('');
  zone       = signal('');
  enService  = signal(true);

  livraisons = signal<ExpeditionListItem[]>([]);
  isLoading  = signal(false);

  stats = { courses: 0, gains: 0, taux: 98 };

  private livreurService = inject(LivreurService);
  private authService    = inject(Auth);
  private router         = inject(Router);

  ngOnInit() {
    const livreurId = this.authService.getUserId();
    if (!livreurId) return;

    // ── CORRECTION : utiliser getNomComplet() au lieu de getUser() ──────────
    const nomComplet = this.authService.getNomComplet() || 'Livreur';
    this.nomLivreur.set(nomComplet);
    this.initiales.set(
      nomComplet
        .split(' ')
        .map((n: string) => n.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase()
    );

    // Charger les livraisons affectées
    this.isLoading.set(true);
    this.livreurService.getMesLivraisons(livreurId).subscribe({
      next: (data) => {
        this.isLoading.set(false);
        this.livraisons.set(data);
        this.stats.courses = data.length;
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  toggleService() {
    this.enService.update(v => !v);
  }

  naviguerVersColis(expedition: ExpeditionListItem) {
    // Stocker l'expédition sélectionnée pour la passer aux écrans suivants
    sessionStorage.setItem('expeditionEnLivraison', JSON.stringify(expedition));
    this.router.navigate(['/livreur/itineraire']);
  }
}