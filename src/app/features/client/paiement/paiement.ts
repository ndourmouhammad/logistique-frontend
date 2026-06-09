import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';

@Component({
  selector: 'app-paiement',
  imports: [CommonModule, RouterModule, FormsModule, ClientLayout],
  templateUrl: './paiement.html',
  styleUrl: './paiement.scss',
})
export class Paiement {
  modePaiement = 'WAVE';
  numeroPaiement = '';
  isLoading = false;
  montant = 3600;

  constructor(private router: Router) {}

  payer() {
    this.isLoading = true;
    // TODO : appel API
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/client/confirmation']);
    }, 2000);
  }
}
