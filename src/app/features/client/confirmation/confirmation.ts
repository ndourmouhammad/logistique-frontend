import { Component, OnInit } from '@angular/core';
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
  expedition: ExpeditionResponse | null = null;
  montantPaye = 0;

  ngOnInit() {
    const data = sessionStorage.getItem('expeditionEnCours');
    const estData = sessionStorage.getItem('estimationExpedition');
    if (data) {
      this.expedition = JSON.parse(data);
      if (estData) {
        const estimation = JSON.parse(estData);
        this.montantPaye = estimation.total || this.expedition!.fraisLivraison;
      } else {
        this.montantPaye = this.expedition!.fraisLivraison;
      }
      sessionStorage.removeItem('expeditionEnCours');
      sessionStorage.removeItem('formulaireExpedition');
      sessionStorage.removeItem('estimationExpedition');
    }
  }
}
