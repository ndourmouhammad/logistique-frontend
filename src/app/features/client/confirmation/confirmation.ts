import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
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
  ref         = signal('');

  private route = inject(ActivatedRoute);

  ngOnInit() {
    // Référence PayTech dans l'URL (?ref=TT-XXXX)
    const ref = this.route.snapshot.queryParamMap.get('ref');
    if (ref) this.ref.set(ref);

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