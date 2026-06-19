import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { ExpeditionService } from '../../../core/services/expedition';
import { Auth } from '../../../core/services/auth';
import { ExpeditionFormData, EstimationResponse } from '../../../core/models/expedition.model';

@Component({
  selector: 'app-recapitulatif',
  imports: [CommonModule, RouterModule, ClientLayout],
  templateUrl: './recapitulatif.html',
  styleUrl: './recapitulatif.scss',
})
export class Recapitulatif implements OnInit {
  formulaire   = signal<ExpeditionFormData | null>(null);
  estimation   = signal<EstimationResponse | null>(null);
  isLoading    = signal(false);
  erreurMessage = signal('');

  private router = inject(Router);
  private expeditionService = inject(ExpeditionService);
  private authService = inject(Auth);

  ngOnInit() {
    const formData = sessionStorage.getItem('formulaireExpedition');
    const estData  = sessionStorage.getItem('estimationExpedition');
    if (formData && estData) {
      this.formulaire.set(JSON.parse(formData));
      this.estimation.set(JSON.parse(estData));
    } else {
      this.router.navigate(['/client/expedition']);
    }
  }

  confirmerEtPayer() {
    this.isLoading.set(true);
    this.erreurMessage.set('');

    const clientId = this.authService.getUserId();
    if (!clientId) {
      this.router.navigate(['/connexion']);
      return;
    }

    const form = this.formulaire();
    if (!form) {
      this.erreurMessage.set('Données de formulaire introuvables.');
      this.isLoading.set(false);
      return;
    }

    this.expeditionService.creerExpedition({
      clientId,
      nomDestinataire:       form.nomDestinataire,
      telephoneDestinataire: form.telDestinataire,
      adresseDepart:         form.adresseDepart,
      villeDepart:           form.villeDepart,
      rue:                   form.rue,
      ville:                 form.ville,
      region:                form.region,
      codePostal:            form.codePostal,
      pays:                  form.pays,
      descriptionContenu:    form.descriptionContenu,
      poids:                 form.poids,
      volume:                form.volume,
      estExpress:            form.estExpress,
      avecRamassage:         form.avecRamassage,
      assurance:             form.assurance,
      valeurDeclaree:        form.valeurDeclaree,
      methodePaiement:       form.methodePaiement,
      modeLivraison: form.modeLivraison,
      pointRelaisDestinationId: form.pointRelaisDestinationId,
    }).subscribe({
      next: (expedition) => {
        this.isLoading.set(false);
        sessionStorage.setItem('expeditionEnCours', JSON.stringify(expedition));
        this.router.navigate(['/client/paiement']);
      },
      error: () => {
        this.isLoading.set(false);
        this.erreurMessage.set("Erreur lors de la création de l'expédition.");
      }
    });
  }

  modifier() {
    this.router.navigate(['/client/expedition']);
  }
}
