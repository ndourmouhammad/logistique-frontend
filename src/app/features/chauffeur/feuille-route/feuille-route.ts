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
  trajetJour   = { depart: 'Dakar', arrivee: 'Saint-Louis', heure: '07h00' };
  kpis         = { hubs: 3, colis: 48, duree: '~5h' };

  etapes = [
    { num: 1, nom: 'Hub Dakar — Liberté VI', heure: '07h00', action: 'Départ', nbColis: 48,  statut: 'DONE',    detail: 'Chargé · 48 colis' },
    { num: 2, nom: 'Hub Thiès',              heure: '09h15', action: 'Arrêt',  nbColis: 12,  statut: 'ACTIVE',  detail: 'Déposer 12 colis' },
    { num: 3, nom: 'Hub Diourbel',           heure: '11h00', action: 'Arrêt',  nbColis: 8,   statut: 'PENDING', detail: 'Déposer 8 colis' },
    { num: 4, nom: 'Hub Saint-Louis',        heure: '12h30', action: 'Fin',    nbColis: 28,  statut: 'PENDING', detail: 'Déposer 28 colis' },
  ];

  constructor(private router: Router) {}

  demarrerChargement() {
    this.router.navigate(['/chauffeur/scan-lot']);
  }
}
