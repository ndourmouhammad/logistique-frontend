import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';

@Component({
  selector: 'app-paiement',
  imports: [CommonModule, RouterModule, ClientLayout],
  templateUrl: './paiement.html',
  styleUrl: './paiement.scss',
})
export class Paiement implements OnInit {
  modePaiement   = signal('WAVE');
  numeroPaiement = signal('');
  isLoading      = signal(false);
  montant        = signal(0);
  expedition     = signal<any>(null);

  private router = inject(Router);

  ngOnInit() {
    const data = sessionStorage.getItem('expeditionEnCours');
    const estData = sessionStorage.getItem('estimationExpedition');
    if (data) {
      const exp = JSON.parse(data);
      this.expedition.set(exp);
      if (estData) {
        const estimation = JSON.parse(estData);
        this.montant.set(estimation.total || exp.fraisLivraison || 0);
      } else {
        this.montant.set(exp.fraisLivraison || 0);
      }
    } else {
      this.router.navigate(['/client/dashboard']);
    }
  }

  payer() {
    this.isLoading.set(true);
    // TODO : appel API
    setTimeout(() => {
      this.isLoading.set(false);
      this.router.navigate(['/client/confirmation']);
    }, 2000);
  }
}
