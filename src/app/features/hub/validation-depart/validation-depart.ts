import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HubLayout } from '../../../shared/components/hub-layout/hub-layout';

@Component({
  selector: 'app-validation-depart',
  imports: [HubLayout, CommonModule, RouterModule],
  templateUrl: './validation-depart.html',
  styleUrl: './validation-depart.scss',
})
export class ValidationDepart {
  isLoading    = false;
  nomLivreur   = 'Ibrahima Balde';
  nbColis      = 4;
  zonelivraison = 'Dakar centre & périphérie nord';

  colis = [
    { code: 'TT-DKR-4839', destination: 'Almadies', type: 'Express' },
    { code: 'TT-DKR-4901', destination: 'Point E',  type: 'Express' },
    { code: 'TT-DKR-4720', destination: 'Médina',   type: 'Standard' },
    { code: 'TT-DKR-4698', destination: 'HLM',      type: 'Standard' },
  ];

  constructor(private router: Router) {}

  validerDepart() {
    this.isLoading = true;
    // TODO : appel API
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/hub/dashboard']);
    }, 1500);
  }
}
