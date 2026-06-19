import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HubLayout } from '../../../shared/components/hub-layout/hub-layout';
import { HubService } from '../../../core/services/hub';
import { LivreurResponse } from '../../../core/models/expedition.model';
import { HubContext } from '../../../core/services/hub-context';

@Component({
  selector: 'app-preparation-expedition',
  imports: [HubLayout, CommonModule, RouterModule],
  templateUrl: './preparation-expedition.html',
  styleUrl: './preparation-expedition.scss',
})
export class PreparationExpedition implements OnInit {
  colisSelectionnes = signal<number[]>([]);
  livreurs          = signal<LivreurResponse[]>([]);
  livreurSelectionneId = signal<number | null>(null);
  isLoading         = signal(false);
  isLoadingLivreurs = signal(false);
  erreurMessage     = signal('');
  successMessage    = signal('');

  private hubContext = inject(HubContext);
  private hubService = inject(HubService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (this.hubContext.isLoaded()) {
        this.chargerLivreursDisponibles();
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

    this.hubContext.chargerHub();
  }

  chargerLivreursDisponibles() {
    this.isLoadingLivreurs.set(true);
    this.hubService.getLivreursDisponibles(this.hubContext.villeHub).subscribe({
      next: (data) => {
        this.isLoadingLivreurs.set(false);
        this.livreurs.set(data);
      },
      error: () => {
        this.isLoadingLivreurs.set(false);
        this.erreurMessage.set('Erreur lors du chargement des livreurs.');
      }
    });
  }

  selectionnerLivreur(id: number) {
    this.livreurSelectionneId.set(id);
  }

  confirmerAffectation() {
    const livreurId = this.livreurSelectionneId();
    if (!livreurId) {
      this.erreurMessage.set('Sélectionnez un livreur.');
      return;
    }

    this.isLoading.set(true);
    this.erreurMessage.set('');

    this.hubService.dispatcher({
      expeditionIds: this.colisSelectionnes(),
      livreurId
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Affectation confirmée ! Le livreur a été notifié.');
        sessionStorage.removeItem('colisSelectionnes');

        // Laisser le message visible 1.5s avant de rediriger
        setTimeout(() => {
          this.router.navigate(['/hub/dashboard']);
        }, 1500);
      },
      error: () => {
        this.isLoading.set(false);
        this.erreurMessage.set("Erreur lors de l'affectation.");
      }
    });
  }

}
