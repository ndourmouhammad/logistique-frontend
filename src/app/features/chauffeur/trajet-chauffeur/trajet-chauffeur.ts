import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ChauffeurLayout } from '../../../shared/components/chauffeur-layout/chauffeur-layout';
import { ChauffeurService } from '../../../core/services/chauffeur';
import { Auth } from '../../../core/services/auth';
import { ExpeditionListItem } from '../../../core/models/relais.model';

@Component({
  selector: 'app-trajet-chauffeur',
  imports: [CommonModule, RouterModule, ChauffeurLayout],
  templateUrl: './trajet-chauffeur.html',
  styleUrl: './trajet-chauffeur.scss',
})
export class TrajetChauffeur implements OnInit {
  prochainHub   = '';
  instructionNav = '';
  eta           = '';
  tempsRestant  = 0;
  vitesse       = 0;
  kmRestants    = 0;
  nbColis       = 0;
  sosActive     = false;

  hasActiveTrajet = false;
  expeditionsEnTransit: ExpeditionListItem[] = [];

  constructor(
    private router: Router,
    private chauffeurService: ChauffeurService,
    private auth: Auth,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadActiveTrajet();
  }

  loadActiveTrajet() {
    const chauffeurId = this.auth.getUserId();
    console.log('[TrajetChauffeur] loadActiveTrajet - chauffeurId:', chauffeurId);
    if (!chauffeurId) {
      console.log('[TrajetChauffeur] Pas de chauffeurId, abandon');
      return;
    }

    this.chauffeurService.getFeuilleRoute(chauffeurId).subscribe({
      next: (res) => {
        console.log('[TrajetChauffeur] Réponse feuille route:', JSON.stringify(res));
        if (res && res.etapes && res.etapes.length > 0 && res.kpis && res.kpis.colis > 0) {
          this.hasActiveTrajet = true;
          
          this.prochainHub = res.trajetJour?.arrivee || 'Destination';
          this.instructionNav = 'Vers ' + this.prochainHub;
          this.nbColis = res.kpis.colis;
          
          this.eta = 'Calcul...';
          this.tempsRestant = 0;
          this.vitesse = 0;
          this.kmRestants = 0;
          console.log('[TrajetChauffeur] hasActiveTrajet = true, prochainHub:', this.prochainHub);
          this.cdr.detectChanges();
        } else {
          console.log('[TrajetChauffeur] Pas de données valides, hasActiveTrajet = false');
          this.hasActiveTrajet = false;
        }
      },
      error: (err) => {
        console.error('[TrajetChauffeur] ERREUR feuille route:', err);
        this.hasActiveTrajet = false;
      }
    });
  }

  declarerArrivee() {
    this.router.navigate(['/chauffeur/validation-transfert']);
  }

  activerSOS() {
    this.sosActive = true;
    // TODO : appel API urgence
  }
}
