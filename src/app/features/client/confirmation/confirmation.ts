import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { ExpeditionResponse } from '../../../core/models/expedition.model';

@Component({
  selector: 'app-confirmation',
  imports: [CommonModule, RouterModule, ClientLayout],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.scss',
})
export class Confirmation implements OnInit {
  expedition  = signal<ExpeditionResponse | null>(null);
  montantPaye = signal(0);

  ngOnInit() {
    const data    = sessionStorage.getItem('expeditionEnCours');
    const estData = sessionStorage.getItem('estimationExpedition');
    if (data) {
      const exp: ExpeditionResponse = JSON.parse(data);
      this.expedition.set(exp);
      if (estData) {
        const estimation = JSON.parse(estData);
        this.montantPaye.set(estimation.total || exp.fraisLivraison);
      } else {
        this.montantPaye.set(exp.fraisLivraison);
      }
      sessionStorage.removeItem('expeditionEnCours');
      sessionStorage.removeItem('formulaireExpedition');
      sessionStorage.removeItem('estimationExpedition');
    }
  }
}
