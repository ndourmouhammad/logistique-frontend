import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ChauffeurLayout } from '../../../shared/components/chauffeur-layout/chauffeur-layout';

@Component({
  selector: 'app-validation-transfert',
  imports: [CommonModule, RouterModule, ChauffeurLayout],
  templateUrl: './validation-transfert.html',
  styleUrl: './validation-transfert.scss',
})
export class ValidationTransfert {
  hubDestination = 'Hub Thiès';
  heureArrivee   = '09h18';
  isLoading      = false;

  trajet = {
    depart:       'Hub Dakar · 07h00',
    arrivee:      'Hub Thiès · 09h18',
    duree:        '2h18 · 185 km',
    colisDeposes: 12,
    colisTotal:   12
  };

  constructor(private router: Router) {}

  confirmerDechargement() {
    this.isLoading = true;
    // TODO : appel API PUT /api/chauffeur/expeditions/{id}/depart
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/chauffeur/historique-tournees']);
    }, 1500);
  }
}
