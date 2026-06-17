import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HubLayout } from '../../../shared/components/hub-layout/hub-layout';
import { ExpeditionService } from '../../../core/services/expedition';
import { HubService } from '../../../core/services/hub';

@Component({
  selector: 'app-remise-guichet',
  imports: [HubLayout, CommonModule, RouterModule],
  templateUrl: './remise-guichet.html',
  styleUrl: './remise-guichet.scss',
})
export class RemiseGuichet {
  codeRecherche  = signal('');
  otpSaisi       = signal('');
  colisTrouve    = signal<any>(null);
  isLoading      = signal(false);
  erreurMessage  = signal('');
  successMessage = signal('');

  private hubService = inject(HubService);
  private expeditionService = inject(ExpeditionService);

  rechercherColis() {
    if (!this.codeRecherche().trim()) return;
    this.erreurMessage.set('');

    this.expeditionService.trackerExpedition(this.codeRecherche().trim()).subscribe({
      next: (data) => {
        this.colisTrouve.set(data);
      },
      error: () => {
        this.erreurMessage.set('Aucune expédition trouvée.');
        this.colisTrouve.set(null);
      }
    });
  }

  validerRemise() {
    if (!this.colisTrouve()) return;

    // On a besoin de l'id, pas seulement du code — on le récupère via le tracking
    // ⚠️ Note : TrackingResponse n'a pas d'id ; on adapte selon vos DTOs réels si besoin
    this.isLoading.set(true);
    this.erreurMessage.set('');

    // Recherche de l'id via l'historique ou un endpoint dédié serait l'idéal.
    // En attendant, on utilise le endpoint avec le code si votre backend le permet,
    // sinon il faudra ajouter un GET by codeTracking retournant l'id.
    this.hubService.remiseGuichet(this.colisTrouve().id, this.otpSaisi()).subscribe({
      next: (expedition) => {
        this.isLoading.set(false);
        this.successMessage.set(`Colis ${expedition.codeTracking} remis avec succès.`);
        this.colisTrouve.set(null);
        this.codeRecherche.set('');
        this.otpSaisi.set('');
      },
      error: () => {
        this.isLoading.set(false);
        this.erreurMessage.set('OTP incorrect ou erreur serveur.');
      }
    });
  }
}
