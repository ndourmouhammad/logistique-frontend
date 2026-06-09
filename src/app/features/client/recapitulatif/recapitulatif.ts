import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';

@Component({
  selector: 'app-recapitulatif',
  imports: [CommonModule, RouterModule, ClientLayout],
  templateUrl: './recapitulatif.html',
  styleUrl: './recapitulatif.scss',
})
export class Recapitulatif {
  // TODO : récupérer depuis un service partagé
  expedition = {
    villeDepart: 'Dakar', adresseDepart: 'Almadies, Rue 12',
    villeArrivee: 'Saint-Louis', adresseArrivee: 'Sor, Av. Faidherbe',
    poids: 2.5, volume: 0.02, description: 'Vêtements',
    nomDestinataire: 'Fatou Diallo', telDestinataire: '+221 77 845 12 34',
    nomExpediteur: 'Alpha Diallo', telExpediteur: '+221 77 845 12 34',
    estExpress: true, avecRamassage: true,
    fraisLivraison: 3600
  };

  constructor(private router: Router) {}

  confirmerEtPayer() {
    this.router.navigate(['/client/paiement']);
  }
}
