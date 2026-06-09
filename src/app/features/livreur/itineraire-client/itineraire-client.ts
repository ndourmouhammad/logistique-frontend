import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-itineraire-client',
  imports: [CommonModule, RouterModule],
  templateUrl: './itineraire-client.html',
  styleUrl: './itineraire-client.scss',
})
export class ItineraireClient {
  codeColis    = 'DKR-4839';
  distance     = '4.2 km';
  duree        = 12;
  eta          = '16h45';
  nomClient    = 'Fatou Diallo';
  adresseClient = 'Almadies, Zone 12, Près brioche dorée';

  constructor(private router: Router) {}

  jesuisArrive() {
    this.router.navigate(['/livreur/validation-livraison']);
  }
}
