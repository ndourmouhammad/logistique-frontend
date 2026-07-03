import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChauffeurLayout } from '../../../shared/components/chauffeur-layout/chauffeur-layout';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-feuille-route',
  imports: [CommonModule, ChauffeurLayout, RouterModule],
  templateUrl: './feuille-route.html',
  styleUrl: './feuille-route.scss',
})
export class FeuilleRoute {
  nomChauffeur = 'Omar Diallo';
  initiales    = 'OD';
  trajetJour   = { depart: '', arrivee: '', heure: '' };
  kpis         = { hubs: 0, colis: 0, duree: '0h' };

  etapes: any[] = [];

  constructor(private router: Router) {}

  demarrerChargement() {
    this.router.navigate(['/chauffeur/scan-lot']);
  }
}
