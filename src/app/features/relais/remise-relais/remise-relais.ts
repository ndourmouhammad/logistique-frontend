import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
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
  codeRecherche = signal('TT-DKR-4588');
  colisEnCours  = signal<any>({
    code:         'TT-DKR-4588',
    destinataire: 'Omar Ndoye',
    tel:          '+221 76 122 88 99',
    contenu:      'Documents · 0,4 kg',
    emplacement:  'A1',
  });

  // Checklist vérification identité
  cniVerifiee      = signal(true);
  nomCorrespond    = signal(true);
  otpVerifie       = signal(false);
  isLoading        = signal(false);

  peutRemettre = computed(() => this.cniVerifiee() && this.nomCorrespond());

  constructor(private router: Router) {}

  rechercherColis() {
    if (this.codeRecherche().toUpperCase().includes('TT')) {
      this.colisEnCours.set({
        code:         this.codeRecherche().toUpperCase(),
        destinataire: 'Omar Ndoye',
        tel:          '+221 76 122 88 99',
        contenu:      'Documents · 0,4 kg',
        emplacement:  'A1',
      });
    }
  }

  confirmerRemise() {
    this.isLoading.set(true);
    // TODO : appel API POST /api/relais/expeditions/{id}/remettre
    setTimeout(() => {
      this.isLoading.set(false);
      this.colisEnCours.set(null);
      this.codeRecherche.set('');
      this.cniVerifiee.set(false);
      this.nomCorrespond.set(false);
    }, 1500);
  }
}
