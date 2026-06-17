import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HubLayout } from '../../../shared/components/hub-layout/hub-layout';
import { ExpeditionService } from '../../../core/services/expedition';
import { HubService } from '../../../core/services/hub';

@Component({
  selector: 'app-remise-guichet',
  imports: [HubLayout, CommonModule, RouterModule, FormsModule],
  templateUrl: './remise-guichet.html',
  styleUrl: './remise-guichet.scss',
})
export class RemiseGuichet {
  codeRecherche = '';
  otpSaisi      = '';
  colisTrouve: any = null;
  isLoading     = false;
  erreurMessage = '';
  successMessage = '';

  private hubService = inject(HubService);
  private expeditionService = inject(ExpeditionService);

  rechercherColis() {
    if (!this.codeRecherche.trim()) return;
    this.erreurMessage = '';

    this.expeditionService.trackerExpedition(this.codeRecherche.trim()).subscribe({
      next: (data) => {
        this.colisTrouve = data;
      },
      error: () => {
        this.erreurMessage = 'Aucune expédition trouvée.';
        this.colisTrouve = null;
      }
    });
  }

  validerRemise() {
    if (!this.colisTrouve) return;

    // On a besoin de l'id, pas seulement du code — on le récupère via le tracking
    // ⚠️ Note : TrackingResponse n'a pas d'id ; on adapte selon vos DTOs réels si besoin
    this.isLoading = true;
    this.erreurMessage = '';

    // Recherche de l'id via l'historique ou un endpoint dédié serait l'idéal.
    // En attendant, on utilise le endpoint avec le code si votre backend le permet,
    // sinon il faudra ajouter un GET by codeTracking retournant l'id.
    this.hubService.remiseGuichet(this.colisTrouve.id, this.otpSaisi).subscribe({
      next: (expedition) => {
        this.isLoading = false;
        this.successMessage = `Colis ${expedition.codeTracking} remis avec succès.`;
        this.colisTrouve = null;
        this.codeRecherche = '';
        this.otpSaisi = '';
      },
      error: () => {
        this.isLoading = false;
        this.erreurMessage = 'OTP incorrect ou erreur serveur.';
      }
    });
  }
}
