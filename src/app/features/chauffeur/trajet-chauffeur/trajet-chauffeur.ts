import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ChauffeurLayout } from '../../../shared/components/chauffeur-layout/chauffeur-layout';

@Component({
  selector: 'app-trajet-chauffeur',
  imports: [CommonModule, RouterModule, ChauffeurLayout],
  templateUrl: './trajet-chauffeur.html',
  styleUrl: './trajet-chauffeur.scss',
})
export class TrajetChauffeur {
  prochainHub   = 'Hub Thiès';
  eta           = '09h15';
  vitesse       = 87;
  kmRestants    = 47;
  nbColis       = 48;
  sosActive     = false;

  constructor(private router: Router) {}

  declarerArrivee() {
    this.router.navigate(['/chauffeur/validation-transfert']);
  }

  activerSOS() {
    this.sosActive = true;
    // TODO : appel API urgence
  }
}
