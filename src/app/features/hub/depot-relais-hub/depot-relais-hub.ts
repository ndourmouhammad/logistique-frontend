import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HubLayout } from '../../../shared/components/hub-layout/hub-layout';
import { HubService } from '../../../core/services/hub';
import { RelaisService } from '../../../core/services/relais';
import { HubContext } from '../../../core/services/hub-context';
import { PointRelaisListItem } from '../../../core/models/relais.model';

@Component({
  selector: 'app-depot-relais-hub',
  imports: [CommonModule, RouterModule, HubLayout],
  templateUrl: './depot-relais-hub.html',
  styleUrl: './depot-relais-hub.scss',
})
export class DepotRelaisHub implements OnInit {

  colisSelectionnes   = signal<number[]>([]);
  pointsRelais        = signal<PointRelaisListItem[]>([]);
  relaisSelectionneId = signal<number | null>(null);
  isLoading           = signal(false);
  isLoadingRelais     = signal(false);
  erreurMessage       = signal('');
  successMessage      = signal('');

  private hubService    = inject(HubService);
  private relaisService = inject(RelaisService);
  private hubContext    = inject(HubContext);
  private router        = inject(Router);

  constructor() {
    // ── Charger les relais dès que le hub est connu ──────────────────────────
    effect(() => {
      if (this.hubContext.isLoaded()) {
        this.chargerPointsRelais();
      }
    });
  }

  ngOnInit() {
    const data = sessionStorage.getItem('colisSelectionnes');
    if (data) {
      this.colisSelectionnes.set(JSON.parse(data));
    } else {
      this.router.navigate(['/hub/tri']);
      return;
    }

    this.hubContext.chargerHub(); // déclenche le chargement du hub
  }

  chargerPointsRelais() {
    const ville = this.hubContext.villeHub;
    if (!ville || ville === 'Dakar' && !this.hubContext.isLoaded()) return;

    this.isLoadingRelais.set(true);
    this.relaisService.getPointsRelaisParVille(ville).subscribe({
      next: (data) => {
        this.isLoadingRelais.set(false);
        this.pointsRelais.set(data);
      },
      error: () => {
        this.isLoadingRelais.set(false);
        this.erreurMessage.set('Erreur lors du chargement des points relais.');
      }
    });
  }

  selectionnerRelais(id: number) {
    this.relaisSelectionneId.set(id);
  }

  confirmerDepot() {
    const relaisId = this.relaisSelectionneId();
    if (!relaisId) {
      this.erreurMessage.set('Sélectionnez un point relais.');
      return;
    }

    this.isLoading.set(true);
    this.erreurMessage.set('');

    const expeditionIds = this.colisSelectionnes();
    let completedCount = 0;

    expeditionIds.forEach(id => {
      this.hubService.deposerAuRelais(id, relaisId).subscribe({
        next: () => {
          completedCount++;
          if (completedCount === expeditionIds.length) {
            this.isLoading.set(false);
            this.successMessage.set('Colis déposés au point relais avec succès !');
            sessionStorage.removeItem('colisSelectionnes');
            setTimeout(() => this.router.navigate(['/hub/dashboard']), 1500);
          }
        },
        error: () => {
          this.isLoading.set(false);
          this.erreurMessage.set('Erreur lors du dépôt au relais.');
        }
      });
    });
  }
}