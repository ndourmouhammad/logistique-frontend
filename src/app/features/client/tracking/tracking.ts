import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { ExpeditionService } from '../../../core/services/expedition';
import { TrackingResponse } from '../../../core/models/expedition.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tracking',
  imports: [CommonModule, RouterModule, FormsModule, ClientLayout],
  templateUrl: './tracking.html',
  styleUrl: './tracking.scss',
})
export class Tracking implements OnInit{
  codeRecherche = '';
  tracking: TrackingResponse | null = null;
  isLoading     = false;
  erreur        = '';



  private expeditionService = inject(ExpeditionService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    // Si code passé en query param → tracker directement
    this.route.queryParams.subscribe(params => {
      if (params['code']) {
        this.codeRecherche = params['code'];
        this.rechercher();
      }
    });
  }

  rechercher() {
    if (!this.codeRecherche.trim()) return;

    this.isLoading = true;
    this.erreur    = '';
    this.tracking  = null;
    this.cdr.detectChanges(); // Forcer la mise à jour UI vers l'état de chargement

    this.expeditionService.trackerExpedition(this.codeRecherche.trim()).subscribe({
      next: (data) => {
        console.log('Tracking reçu :', data); // ← debug
        this.isLoading = false;
        this.tracking  = data;
        this.cdr.detectChanges(); // Forcer la détection
      },
      error: (err) => {
        console.error('Erreur tracking :', err); // ← debug
        this.isLoading = false;
        this.erreur = err.status === 404
          ? 'Aucune expédition trouvée pour ce code.'
          : 'Erreur serveur. Réessayez.';
        this.cdr.detectChanges(); // Forcer la détection
      },
      complete: () => {
        this.isLoading = false; // ← sécurité
        this.cdr.detectChanges(); // Forcer la détection
      }
    });
  }
}
