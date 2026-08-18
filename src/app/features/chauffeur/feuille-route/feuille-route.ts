import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChauffeurLayout } from '../../../shared/components/chauffeur-layout/chauffeur-layout';
import { RouterModule, Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { ChauffeurService } from '../../../core/services/chauffeur';
import { ExpeditionListItem } from '../../../core/models/relais.model';

@Component({
  selector: 'app-feuille-route',
  imports: [CommonModule, ChauffeurLayout, RouterModule],
  templateUrl: './feuille-route.html',
  styleUrl: './feuille-route.scss',
})
export class FeuilleRoute implements OnInit {
  nomChauffeur = '';
  initiales    = '';
  trajetJour   = { depart: '', arrivee: '', heure: '' };
  kpis         = { hubs: 0, colis: 0, duree: '0h' };

  etapes: any[] = [];

  private authService = inject(Auth);
  private chauffeurService = inject(ChauffeurService);
  private cdr = inject(ChangeDetectorRef);

  constructor(private router: Router) {}

  ngOnInit() {
    const nom = this.authService.getNomComplet() || 'Chauffeur';
    this.nomChauffeur = nom;
    this.initiales = nom.trim().split(/\s+/).map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase();
    
    this.chargerFeuilleRoute();
  }

  chargerFeuilleRoute() {
    const chauffeurId = this.authService.getUserId();
    if (!chauffeurId) return;

    this.chauffeurService.getFeuilleRoute(chauffeurId).subscribe({
      next: (res) => {
        if (res) {
          this.trajetJour = res.trajetJour || { depart: '?', arrivee: '?', heure: '?' };
          this.kpis = res.kpis || { hubs: 0, colis: 0, duree: '0h' };
          
          let fetchedEtapes = res.etapes || [];
          // Adaptation dynamique côté frontend : si l'étape est terminée, on change le libellé
          fetchedEtapes = fetchedEtapes.map((etape: any) => {
            if (etape.statut === 'DONE' && etape.detail && etape.detail.includes('à charger')) {
              etape.detail = etape.detail.replace('à charger', 'chargés');
            }
            return etape;
          });
          
          this.etapes = fetchedEtapes;
          this.cdr.detectChanges(); // Forcer la mise à jour de la vue
        }
      },
      error: (err) => {
        // Gérer l'erreur silencieusement ou via un service de notification
      }
    });
  }

  get isChargementTermine(): boolean {
    if (this.etapes && this.etapes.length > 0) {
      return this.etapes[0].statut === 'DONE';
    }
    return false;
  }

  actionPrincipale() {
    if (this.isChargementTermine) {
      this.router.navigate(['/chauffeur/trajet']);
    } else {
      this.router.navigate(['/chauffeur/scan-lot']);
    }
  }
}
