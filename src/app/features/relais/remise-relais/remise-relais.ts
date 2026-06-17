import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RelaisLayout } from '../../../shared/components/relais-layout/relais-layout';
import { RelaisService } from '../../../core/services/relais';
import { ExpeditionListItem } from '../../../core/services/hub';

@Component({
  selector: 'app-remise-relais',
  imports: [CommonModule, RouterModule, FormsModule, RelaisLayout],
  templateUrl: './remise-relais.html',
  styleUrl: './remise-relais.scss',
})
export class RemiseRelais {
  codeRecherche = signal('');
  colisEnCours  = signal<ExpeditionListItem | null>(null);
  otpSaisi      = signal('');

  // Checklist vérification identité
  cniVerifiee   = signal(false);
  nomCorrespond = signal(false);
  otpVerifie    = signal(false);

  isLoading      = signal(false);
  erreurMessage  = signal('');
  successMessage = signal('');

  relaisId = 5;

  // Pour activer le bouton : identité vérifiée ET un OTP saisi (non vide)
  peutRemettre = computed(() =>
    this.cniVerifiee() && this.nomCorrespond() && this.otpSaisi().trim().length > 0
  );

  private relaisService = inject(RelaisService);

  constructor(private router: Router) {}

  rechercherColis() {
    const code = this.codeRecherche().trim().toUpperCase();
    if (!code) return;

    this.erreurMessage.set('');
    this.colisEnCours.set(null);

    // On utilise getStock() pour retrouver le colis correspondant au code saisi
    this.relaisService.getStock(this.relaisId).subscribe({
      next: (stock) => {
        const colis = stock.find(c => c.codeTracking === code);
        if (colis) {
          this.colisEnCours.set(colis);
        } else {
          this.erreurMessage.set('Aucun colis en stock avec ce code.');
        }
      },
      error: () => {
        this.erreurMessage.set('Erreur lors de la recherche.');
      }
    });
  }

  onOtpChange(value: string) {
    this.otpSaisi.set(value);
  }

  confirmerRemise() {
    const colis = this.colisEnCours();
    if (!colis) return;

    this.isLoading.set(true);
    this.erreurMessage.set('');

    this.relaisService.remettreAuClient(colis.id, this.otpSaisi().trim()).subscribe({
      next: (expedition) => {
        this.isLoading.set(false);
        this.successMessage.set(`Colis ${expedition.codeTracking} remis avec succès.`);

        // Reset complet du formulaire
        this.colisEnCours.set(null);
        this.codeRecherche.set('');
        this.otpSaisi.set('');
        this.cniVerifiee.set(false);
        this.nomCorrespond.set(false);
        this.otpVerifie.set(false);

        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: () => {
        this.isLoading.set(false);
        this.erreurMessage.set('Code OTP incorrect ou erreur serveur.');
      }
    });
  }
}