import { Component, inject, OnInit, signal } from '@angular/core';
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
export class Tracking implements OnInit {
  codeRecherche = signal('');
  tracking      = signal<TrackingResponse | null>(null);
  isLoading     = signal(false);
  erreur        = signal('');

  private expeditionService = inject(ExpeditionService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    // Si code passé en query param → tracker directement
    this.route.queryParams.subscribe(params => {
      if (params['code']) {
        this.codeRecherche.set(params['code']);
        this.rechercher();
      }
    });
  }

  rechercher() {
    if (!this.codeRecherche().trim()) return;

    this.isLoading.set(true);
    this.erreur.set('');
    this.tracking.set(null);

    this.expeditionService.trackerExpedition(this.codeRecherche().trim()).subscribe({
      next: (data) => {
        console.log('Tracking reçu :', data); // ← debug
        this.isLoading.set(false);
        this.tracking.set(data);
      },
      error: (err) => {
        console.error('Erreur tracking :', err); // ← debug
        this.isLoading.set(false);
        this.erreur.set(err.status === 404
          ? 'Aucune expédition trouvée pour ce code.'
          : 'Erreur serveur. Réessayez.');
      },
      complete: () => {
        this.isLoading.set(false); // ← sécurité
      }
    });
  }
}
