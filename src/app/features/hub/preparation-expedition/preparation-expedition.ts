import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HubLayout } from '../../../shared/components/hub-layout/hub-layout';
import { HubService } from '../../../core/services/hub';

@Component({
  selector: 'app-preparation-expedition',
  imports: [HubLayout, CommonModule, RouterModule],
  templateUrl: './preparation-expedition.html',
  styleUrl: './preparation-expedition.scss',
})
export class PreparationExpedition implements OnInit {
  colisSelectionnes = signal<number[]>([]);
  livreurSelectionneId = signal<number | null>(null);
  isLoading = signal(false);
  erreurMessage = signal('');

  // ⚠️ À remplacer plus tard par un vrai GET /api/livreurs/disponibles
  livreurs = [
    { id: 2, initiales: 'IB', nom: 'Ibrahima Balde', vehicule: 'Moto', zone: 'Dakar', note: 4.8, statut: 'DISPONIBLE', distance: 1.2 },
    { id: 3, initiales: 'AS', nom: 'Amadou Sow',      vehicule: 'Moto', zone: 'Dakar', note: 4.6, statut: 'DISPONIBLE', distance: 2.8 },
  ];

  private hubService = inject(HubService);
  private router = inject(Router);

  ngOnInit() {
    const data = sessionStorage.getItem('colisSelectionnes');
    if (data) {
      this.colisSelectionnes.set(JSON.parse(data));
    } else {
      this.router.navigate(['/hub/tri']);
    }
  }

  selectionnerLivreur(id: number) {
    this.livreurSelectionneId.set(id);
  }

  confirmerAffectation() {
    if (!this.livreurSelectionneId()) {
      this.erreurMessage.set('Sélectionnez un livreur.');
      return;
    }

    this.isLoading.set(true);
    this.hubService.dispatcher({
      expeditionIds: this.colisSelectionnes(),
      livreurId: this.livreurSelectionneId()!
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        sessionStorage.removeItem('colisSelectionnes');
        this.router.navigate(['/hub/dashboard']);
      },
      error: () => {
        this.isLoading.set(false);
        this.erreurMessage.set("Erreur lors de l'affectation.");
      }
    });
  }
}
