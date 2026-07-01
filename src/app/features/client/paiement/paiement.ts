import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { ExpeditionService } from '../../../core/services/expedition';

@Component({
  selector: 'app-paiement',
  imports: [CommonModule, RouterModule, ClientLayout],
  templateUrl: './paiement.html',
  styleUrl: './paiement.scss',
})
export class Paiement implements OnInit {

  isLoading     = signal(true); // true dès le départ — on redirige automatiquement
  montant       = signal(0);
  expedition    = signal<any>(null);
  erreurMessage = signal('');

  private router            = inject(Router);
  private expeditionService = inject(ExpeditionService);

  ngOnInit() {
    const data    = sessionStorage.getItem('expeditionEnCours');
    const estData = sessionStorage.getItem('estimationExpedition');

    if (!data) {
      this.router.navigate(['/client/dashboard']);
      return;
    }

    const exp = JSON.parse(data);
    this.expedition.set(exp);

    if (estData) {
      const estimation = JSON.parse(estData);
      this.montant.set(estimation.total || exp.fraisLivraison || 0);
    } else {
      this.montant.set(exp.fraisLivraison || 0);
    }

    // ── Redirection automatique vers PayTech ─────────────────────────────
    this.expeditionService.initierPaiement(exp.id).subscribe({
      next: (response) => {
        if (response.success && response.redirectUrl) {
          // Nettoyer sessionStorage avant de partir
          sessionStorage.removeItem('formulaireExpedition');
          sessionStorage.removeItem('estimationExpedition');
          sessionStorage.removeItem('expeditionEnCours');
          // Rediriger vers PayTech
          window.location.href = response.redirectUrl;
        } else {
          this.isLoading.set(false);
          this.erreurMessage.set("Erreur lors de l'initialisation du paiement.");
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.erreurMessage.set('Erreur de communication avec le service de paiement.');
      }
    });
  }
}