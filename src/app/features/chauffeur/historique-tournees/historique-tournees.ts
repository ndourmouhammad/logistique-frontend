import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChauffeurLayout } from '../../../shared/components/chauffeur-layout/chauffeur-layout';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-historique-tournees',
  imports: [CommonModule, RouterModule, ChauffeurLayout],
  templateUrl: './historique-tournees.html',
  styleUrl: './historique-tournees.scss',
})
export class HistoriqueTournees implements OnInit {
  nomChauffeur = '';
  initiales    = '';

  private authService = inject(Auth);

  ngOnInit() {
    const nom = this.authService.getNomComplet() || 'Chauffeur';
    this.nomChauffeur = nom;
    this.initiales = nom.trim().split(/\s+/).map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase();
  }

  tourneeActive = {
    code:     'T-DKR-STL-01',
    depart:   'Hub Dakar Centre',
    arrivee:  'Hub Saint-Louis',
    eta:      '22:45',
    nbColis:  25,
    vehicule: 'DK-1234-A',
    statut:   'EN_COURS'
  };

  historique = [
    { trajet: 'Saint-Louis → Dakar',        date: 'Hier, 08:00 - 12:30',     nbLots: 18, statut: 'TERMINE' },
    { trajet: 'Dakar → Thiès → Dakar',      date: '05 Mai, 09:00 - 15:00',   nbLots: 42, statut: 'TERMINE' },
  ];
}
