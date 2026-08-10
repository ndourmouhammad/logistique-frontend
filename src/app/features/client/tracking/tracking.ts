import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { ExpeditionService } from '../../../core/services/expedition';
import { Auth } from '../../../core/services/auth';
import { ExpeditionResponse, TrackingResponse } from '../../../core/models/expedition.model';
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
  mesExpeditions = signal<ExpeditionResponse[]>([]);

  private expeditionService = inject(ExpeditionService);
  private route = inject(ActivatedRoute);
  private auth = inject(Auth);

  ngOnInit() {
    // Si l'utilisateur est connecté, charger ses expéditions récentes
    const userId = this.auth.getUserId();
    if (userId) {
      this.expeditionService.getHistoriqueClient(userId).subscribe({
        next: (data) => {
          // Trier par date décroissante pour avoir les plus récents
          const triees = data.sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());
          this.mesExpeditions.set(triees);
        }
      });
    }

    // Si code passé en query param → tracker directement
    this.route.queryParams.subscribe(params => {
      if (params['code']) {
        this.codeRecherche.set(params['code']);
        this.rechercher();
      }
    });
  }

  onSelectCode(event: Event) {
    const code = (event.target as HTMLSelectElement).value;
    if (code) {
      this.codeRecherche.set(code);
      this.rechercher();
    }
  }

  rechercher() {
    if (!this.codeRecherche().trim()) return;

    this.isLoading.set(true);
    this.erreur.set('');
    this.tracking.set(null);

    this.expeditionService.trackerExpedition(this.codeRecherche().trim()).subscribe({
      next: (data) => {

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
