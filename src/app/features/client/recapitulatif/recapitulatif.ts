import { Component, inject, OnInit } from '@angular/core';
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
  formulaire: ExpeditionFormData | null = null;
  estimation: EstimationResponse | null = null;
  isLoading = false;
  erreurMessage = '';

  private router = inject(Router);
  private expeditionService = inject(ExpeditionService);
  private authService = inject(Auth);

  ngOnInit() {
    const formData = sessionStorage.getItem('formulaireExpedition');
    const estData = sessionStorage.getItem('estimationExpedition');
    if (formData && estData) {
      this.formulaire = JSON.parse(formData);
      this.estimation = JSON.parse(estData);
    } else {
      this.router.navigate(['/client/expedition']);
    }
  }

  confirmerEtPayer() {
    this.isLoading = true;
    this.erreurMessage = '';

    const clientId = this.authService.getUserId();
    if (!clientId) {
      this.router.navigate(['/connexion']);
      return;
    }

    if (!this.formulaire) {
      this.erreurMessage = 'Données de formulaire introuvables.';
      this.isLoading = false;
      return;
    }

    this.expeditionService.creerExpedition({
      clientId,
      nomDestinataire:       this.formulaire.nomDestinataire,
      telephoneDestinataire: this.formulaire.telDestinataire,
      adresseDepart:         this.formulaire.adresseDepart,
      villeDepart:           this.formulaire.villeDepart,
      rue:                   this.formulaire.rue,
      ville:                 this.formulaire.ville,
      region:                this.formulaire.region,
      codePostal:            this.formulaire.codePostal,
      pays:                  this.formulaire.pays,
      descriptionContenu:    this.formulaire.descriptionContenu,
      poids:                 this.formulaire.poids,
      volume:                this.formulaire.volume,
      estExpress:            this.formulaire.estExpress,
      avecRamassage:         this.formulaire.avecRamassage,
      assurance:             this.formulaire.assurance,
      valeurDeclaree:        this.formulaire.valeurDeclaree,
      methodePaiement:       this.formulaire.methodePaiement,
    }).subscribe({
      next: (expedition) => {
        this.isLoading = false;
        sessionStorage.setItem('expeditionEnCours', JSON.stringify(expedition));
        this.router.navigate(['/client/paiement']);
      },
      error: () => {
        this.isLoading = false;
        this.erreurMessage = 'Erreur lors de la création de l\'expédition.';
      }
    });
  }

  modifier() {
    this.router.navigate(['/client/expedition']);
  }
}
