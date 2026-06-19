import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChauffeurLayout } from '../../../shared/components/chauffeur-layout/chauffeur-layout';
import { ChauffeurService } from '../../../core/services/chauffeur';
import { Auth } from '../../../core/services/auth';
import { ExpeditionListItem } from '../../../core/models/relais.model';

@Component({
  selector: 'app-scan-lot',
  imports: [CommonModule, RouterModule, FormsModule, ChauffeurLayout],
  templateUrl: './scan-lot.html',
  styleUrl: './scan-lot.scss',
})
export class ScanLot implements OnInit {

  expeditions    = signal<ExpeditionListItem[]>([]);
  isLoading      = signal(false);
  erreurMessage  = signal('');
  isValidating   = signal(false);

  get hubNom()       { return 'Hub Dakar'; }        // ⚠️ en dur pour l'instant
  get lieuDepart()   { return 'Dakar'; }

  totalColis    = computed(() => this.expeditions().length);
  colisCharges  = computed(() => this.expeditions().length); // tous chargés par défaut
  progression   = computed(() =>
    this.totalColis() > 0
      ? Math.round((this.colisCharges() / this.totalColis()) * 100)
      : 0
  );

  private chauffeurService = inject(ChauffeurService);
  private authService      = inject(Auth);
  private router           = inject(Router);

  ngOnInit() {
    this.chargerExpeditions();
  }

  chargerExpeditions() {
    const chauffeurId = this.authService.getUserId();
    if (!chauffeurId) return;

    this.isLoading.set(true);
    this.chauffeurService.getMesExpeditions(chauffeurId).subscribe({
      next: (data) => {
        this.isLoading.set(false);
        this.expeditions.set(data);
      },
      error: () => {
        this.isLoading.set(false);
        this.erreurMessage.set('Erreur lors du chargement des expéditions.');
      }
    });
  }

  validerEtDemarrer() {
    const chauffeurId = this.authService.getUserId();
    if (!chauffeurId || this.expeditions().length === 0) return;

    this.isValidating.set(true);
    this.erreurMessage.set('');

    // Déclencher le départ pour toutes les expéditions affectées
    const expeditionIds = this.expeditions().map(e => e.id);
    let completedCount = 0;
    let hasError = false;

    expeditionIds.forEach(id => {
      this.chauffeurService.partirInterHub(id, chauffeurId, this.lieuDepart).subscribe({
        next: () => {
          completedCount++;
          if (completedCount === expeditionIds.length && !hasError) {
            this.isValidating.set(false);
            this.router.navigate(['/chauffeur/trajet']);
          }
        },
        error: () => {
          hasError = true;
          this.isValidating.set(false);
          this.erreurMessage.set('Erreur lors du démarrage du trajet pour un ou plusieurs colis.');
        }
      });
    });
  }
}