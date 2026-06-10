import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HubLayout } from '../../../shared/components/hub-layout/hub-layout';

@Component({
  selector: 'app-remise-guichet',
  imports: [HubLayout, CommonModule, RouterModule, FormsModule],
  templateUrl: './remise-guichet.html',
  styleUrl: './remise-guichet.scss',
})
export class RemiseGuichet {
  codeRecherche = '';
  colisEnCours: any = null;
  otpSaisi      = '';
  isLoading     = false;

  rechercherColis() {
    // Simulation
    if (this.codeRecherche.toUpperCase().includes('TT')) {
      this.colisEnCours = {
        code:           this.codeRecherche.toUpperCase(),
        nomDestinataire: 'Fatou Diallo',
        tel:             '+221 77 845 12 34',
        description:    'Vêtements · 2.5 kg',
        dateArrivee:    'Aujourd\'hui 11h42',
        zone:           'B-12',
      };
    }
  }

  constructor(private router: Router) {}

  validerRemise() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.colisEnCours = null;
      this.codeRecherche = '';
      this.otpSaisi = '';
    }, 1500);
  }
}
