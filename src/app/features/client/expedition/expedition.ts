import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';

@Component({
  selector: 'app-expedition',
  imports: [CommonModule, RouterModule, FormsModule, ClientLayout],
  templateUrl: './expedition.html',
  styleUrl: './expedition.scss',
})
export class Expedition {
  etape = 1;

  // Expéditeur
  nomExpediteur  = '';
  telExpediteur  = '';
  adresseDepart  = '';
  villeDepart    = 'Dakar';

  // Destinataire
  nomDestinataire  = '';
  telDestinataire  = '';
  adresseArrivee   = '';
  villeArrivee     = 'Saint-Louis';

  // Colis
  poids            = '';
  volume           = '';
  description      = '';
  valeurDeclaree   = '';
  assurance        = false;
  estExpress       = false;
  avecRamassage    = false;

  villes = ['Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 'Mbour', 'Louga'];

  constructor(private router: Router) {}

  suivant() {
    if (this.etape < 3) this.etape++;
    else this.router.navigate(['/client/recapitulatif']);
  }

  precedent() {
    if (this.etape > 1) this.etape--;
  }
}
