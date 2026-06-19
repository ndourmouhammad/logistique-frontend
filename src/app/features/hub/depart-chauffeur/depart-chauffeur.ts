import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HubLayout } from '../../../shared/components/hub-layout/hub-layout';
import { HubService } from '../../../core/services/hub';
import { ChauffeurResponse } from '../../../core/models/expedition.model';

@Component({
  selector: 'app-depart-chauffeur',
  imports: [CommonModule, RouterModule, HubLayout],
  templateUrl: './depart-chauffeur.html',
  styleUrl: './depart-chauffeur.scss',
})
export class DepartChauffeur implements OnInit {

  colisSelectionnes = signal<number[]>([]);
  chauffeurs        = signal<ChauffeurResponse[]>([]);
  chauffeurSelectionneId = signal<number | null>(null);
  isLoading          = signal(false);
  isLoadingChauffeurs = signal(false);
  erreurMessage      = signal('');
  successMessage     = signal('');

  private hubService = inject(HubService);
  private router = inject(Router);

  ngOnInit() {
    const data = sessionStorage.getItem('colisSelectionnes');
    if (data) {
      this.colisSelectionnes.set(JSON.parse(data));
    } else {
      this.router.navigate(['/hub/tri']);
      return;
    }

    this.chargerChauffeurs();
  }

  chargerChauffeurs() {
    this.isLoadingChauffeurs.set(true);
    this.hubService.getChauffeursDisponibles().subscribe({
      next: (data) => {
        this.isLoadingChauffeurs.set(false);
        this.chauffeurs.set(data);
      },
      error: () => {
        this.isLoadingChauffeurs.set(false);
        this.erreurMessage.set('Erreur lors du chargement des chauffeurs.');
      }
    });
  }

  selectionnerChauffeur(id: number) {
    this.chauffeurSelectionneId.set(id);
  }

  confirmerAffectation() {
    const chauffeurId = this.chauffeurSelectionneId();
    if (!chauffeurId) {
      this.erreurMessage.set('Sélectionnez un chauffeur.');
      return;
    }

    this.isLoading.set(true);
    this.erreurMessage.set('');

    this.hubService.dispatcherChauffeur({
      expeditionIds: this.colisSelectionnes(),
      chauffeurId
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Chauffeur affecté ! Le colis est prêt pour le départ inter-hub.');
        sessionStorage.removeItem('colisSelectionnes');

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