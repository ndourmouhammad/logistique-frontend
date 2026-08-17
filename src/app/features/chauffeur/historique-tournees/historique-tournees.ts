import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChauffeurLayout } from '../../../shared/components/chauffeur-layout/chauffeur-layout';
import { Auth } from '../../../core/services/auth';
import { ChauffeurService } from '../../../core/services/chauffeur';

@Component({
  selector: 'app-historique-tournees',
  imports: [CommonModule, RouterModule, ChauffeurLayout],
  templateUrl: './historique-tournees.html',
  styleUrl: './historique-tournees.scss',
})
export class HistoriqueTournees implements OnInit {
  nomChauffeur = '';
  initiales    = '';

  tourneeActive: any = null;

  historique: any[] = [];

  private authService = inject(Auth);
  private chauffeurService = inject(ChauffeurService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    const nom = this.authService.getNomComplet() || 'Chauffeur';
    this.nomChauffeur = nom;
    this.initiales = nom.trim().split(/\s+/).map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase();

    this.chargerTourneeActive();
    this.chargerHistorique();
  }

  chargerHistorique() {
    const chauffeurId = this.authService.getUserId();
    if (!chauffeurId) return;

    this.chauffeurService.getHistoriqueTournees(chauffeurId).subscribe({
      next: (res) => {
        if (res) {
          this.historique = res;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.historique = [];
        this.cdr.detectChanges();
      }
    });
  }

  chargerTourneeActive() {
    const chauffeurId = this.authService.getUserId();
    if (!chauffeurId) return;

    this.chauffeurService.getFeuilleRoute(chauffeurId).subscribe({
      next: (res) => {
        // Si on a des colis, c'est qu'il y a une tournée en cours
        if (res && res.kpis && res.kpis.colis > 0) {
          this.tourneeActive = {
            code:     'T-EN-COURS', // Code générique
            depart:   res.trajetJour.depart,
            arrivee:  res.trajetJour.arrivee,
            eta:      res.trajetJour.heure,
            nbColis:  res.kpis.colis,
            vehicule: 'Camion assigné', 
            statut:   'EN_COURS'
          };
        } else {
          this.tourneeActive = null;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.tourneeActive = null;
        this.cdr.detectChanges();
      }
    });
  }

}
