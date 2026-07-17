import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { ExpeditionResponse } from '../../../core/models/expedition.model';
import { ExpeditionService } from '../../../core/services/expedition';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule, ClientLayout],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.scss',
})
export class Confirmation implements OnInit {

  expedition  = signal<ExpeditionResponse | null>(null);
  montantPaye = signal(0);
  isLoading   = signal(true);
  erreur      = signal('');

  private route  = inject(ActivatedRoute);
  private expeditionService = inject(ExpeditionService);

  ngOnInit() {
    const ref = this.route.snapshot.queryParamMap.get('ref');

    if (ref) {
      // ── Charger depuis l'API via la référence PayTech ──────────────────
      this.expeditionService.getExpeditionParRefPaytech(ref).subscribe({
        next: (exp) => {
          this.expedition.set(exp);
          this.montantPaye.set(exp.fraisLivraison || 0);
          this.isLoading.set(false);
          // Nettoyer sessionStorage
          sessionStorage.removeItem('expeditionEnCours');
          sessionStorage.removeItem('formulaireExpedition');
          sessionStorage.removeItem('estimationExpedition');
        },
        error: () => {
          this.isLoading.set(false);
          this.erreur.set('Impossible de charger les détails de la confirmation.');
        }
      });
    } else {
      // ── Fallback sessionStorage (si accès direct sans ref) ────────────
      const data    = sessionStorage.getItem('expeditionEnCours');
      const estData = sessionStorage.getItem('estimationExpedition');
      if (data) {
        try {
          const exp: ExpeditionResponse = JSON.parse(data);
          this.expedition.set(exp);
          if (estData) {
            this.montantPaye.set(JSON.parse(estData).total || exp.fraisLivraison);
          } else {
            this.montantPaye.set(exp.fraisLivraison);
          }
          this.isLoading.set(false);
          sessionStorage.removeItem('expeditionEnCours');
          sessionStorage.removeItem('formulaireExpedition');
          sessionStorage.removeItem('estimationExpedition');
        } catch (e) {
          this.isLoading.set(false);
          this.erreur.set('Données corrompues, impossible de charger la confirmation.');
        }
      } else {
        this.isLoading.set(false);
        this.erreur.set('Aucune expédition trouvée.');
      }
    }
  }
}