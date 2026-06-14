import { Component, OnInit } from '@angular/core';
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
export class Paiement implements OnInit {
  modePaiement = 'WAVE';
  numeroPaiement = '';
  isLoading = false;
  montant = 0;
  expedition: any = null;

  constructor(private router: Router) {}

  ngOnInit() {
    const data = sessionStorage.getItem('expeditionEnCours');
    const estData = sessionStorage.getItem('estimationExpedition');
    if (data) {
      this.expedition = JSON.parse(data);
      if (estData) {
        const estimation = JSON.parse(estData);
        this.montant = estimation.total || this.expedition.fraisLivraison || 0;
      } else {
        this.montant = this.expedition.fraisLivraison || 0;
      }
    } else {
      this.router.navigate(['/client/dashboard']);
    }
  }

  payer() {
    this.isLoading = true;
    // TODO : appel API
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/client/confirmation']);
    }, 2000);
  }
}
