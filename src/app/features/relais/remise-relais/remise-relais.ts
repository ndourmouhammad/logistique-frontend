import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RelaisLayout } from '../../../shared/components/relais-layout/relais-layout';

@Component({
  selector: 'app-remise-relais',
  imports: [CommonModule, RouterModule, FormsModule, RelaisLayout],
  templateUrl: './remise-relais.html',
  styleUrl: './remise-relais.scss',
})
export class RemiseRelais {
  codeRecherche = 'TT-DKR-4588';
  colisEnCours: any = {
    code:         'TT-DKR-4588',
    destinataire: 'Omar Ndoye',
    tel:          '+221 76 122 88 99',
    contenu:      'Documents · 0,4 kg',
    emplacement:  'A1',
  };

  // Checklist vérification identité
  cniVerifiee      = true;
  nomCorrespond    = true;
  otpVerifie       = false;
  isLoading        = false;

  get peutRemettre(): boolean {
    return this.cniVerifiee && this.nomCorrespond;
  }

  constructor(private router: Router) {}

  rechercherColis() {
    if (this.codeRecherche.toUpperCase().includes('TT')) {
      this.colisEnCours = {
        code:         this.codeRecherche.toUpperCase(),
        destinataire: 'Omar Ndoye',
        tel:          '+221 76 122 88 99',
        contenu:      'Documents · 0,4 kg',
        emplacement:  'A1',
      };
    }
  }

  confirmerRemise() {
    this.isLoading = true;
    // TODO : appel API POST /api/relais/expeditions/{id}/remettre
    setTimeout(() => {
      this.isLoading = false;
      this.colisEnCours = null;
      this.codeRecherche = '';
      this.cniVerifiee = false;
      this.nomCorrespond = false;
    }, 1500);
  }
}
