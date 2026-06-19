import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ExpeditionListItem } from '../../../core/models/relais.model';


@Component({
  selector: 'app-itineraire-client',
  imports: [CommonModule, RouterModule],
  templateUrl: './itineraire-client.html',
  styleUrl: './itineraire-client.scss',
})
export class ItineraireClient implements OnInit {

  expedition = signal<ExpeditionListItem | null>(null);

  codeColis     = signal('');
  nomClient     = signal('');
  adresseClient = signal('');
  distance      = '~';
  duree         = 0;
  eta           = '--';

  constructor(private router: Router) {}

  ngOnInit() {
    const data = sessionStorage.getItem('expeditionEnLivraison');
    if (data) {
      const e: ExpeditionListItem = JSON.parse(data);
      this.expedition.set(e);
      this.codeColis.set(e.codeTracking);
      this.nomClient.set(e.nomDestinataire);
      this.adresseClient.set(e.villeDestinataire);
    } else {
      this.router.navigate(['/livreur/dashboard']);
    }
  }

  jesuisArrive() {
    this.router.navigate(['/livreur/validation-livraison']);
  }
}