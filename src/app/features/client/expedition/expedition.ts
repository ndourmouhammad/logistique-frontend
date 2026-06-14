import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { ExpeditionService } from '../../../core/services/expedition';
import { Auth } from '../../../core/services/auth';


@Component({
  selector: 'app-expedition',
  imports: [CommonModule, RouterModule, FormsModule, ClientLayout],
  templateUrl: './expedition.html',
  styleUrl: './expedition.scss',
})
export class Expedition {
  etape = 1;

  // Expéditeur
  adresseDepart = '';
  villeDepart   = 'Dakar';

  // Destinataire
  nomDestinataire   = '';
  telDestinataire   = '';
  rue               = '';
  ville             = 'Thiès';
  region            = '';
  codePostal        = '';
  pays              = 'Sénégal';

  // Colis
  descriptionContenu = '';
  poids              = 0;
  volume             = 0;
  estExpress         = false;
  methodePaiement    = 'WAVE';

  isLoading      = false;
  erreurMessage  = '';

  villes = ['Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 'Mbour', 'Louga'];
  moyensPaiement = ['WAVE', 'ORANGE_MONEY', 'FREE_MONEY'];

  private expeditionService = inject(ExpeditionService);
  private authService = inject(Auth);
  private router = inject(Router);

  suivant() {
    if (this.etape < 3) {
      this.etape++;
    } else {
      this.soumettre();
    }
  }

  precedent() {
    if (this.etape > 1) this.etape--;
  }

  soumettre() {
    this.isLoading    = true;
    this.erreurMessage = '';

    const clientId = this.authService.getUserId();
    if (!clientId) {
      this.router.navigate(['/connexion']);
      return;
    }

    this.expeditionService.creerExpedition({
      clientId,
      nomDestinataire:       this.nomDestinataire,
      telephoneDestinataire: this.telDestinataire,
      adresseDepart:         this.adresseDepart,
      rue:                   this.rue,
      ville:                 this.ville,
      region:                this.region,
      codePostal:            this.codePostal,
      pays:                  this.pays,
      descriptionContenu:    this.descriptionContenu,
      poids:                 this.poids,
      volume:                this.volume,
      estExpress:            this.estExpress,
      methodePaiement:       this.methodePaiement,
    }).subscribe({
      next: (expedition) => {
        this.isLoading = false;
        // Stocker le résultat pour la page récapitulatif
        sessionStorage.setItem('expeditionEnCours', JSON.stringify(expedition));
        this.router.navigate(['/client/recapitulatif']);
      },
      error: (err) => {
        this.isLoading = false;
        this.erreurMessage = 'Erreur lors de la création. Réessayez.';
        console.error(err);
      }
    });
  }
}
