import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChauffeurLayout } from '../../../shared/components/chauffeur-layout/chauffeur-layout';

@Component({
  selector: 'app-scan-lot',
  imports: [CommonModule, RouterModule, FormsModule, ChauffeurLayout],
  templateUrl: './scan-lot.html',
  styleUrl: './scan-lot.scss',
})
export class ScanLot {
  hubNom        = 'Hub Dakar';
  totalColis    = 48;
  colisCharges  = 38;
  codeSaisi     = '';
  dernierScan   = 'TT-DKR-4839';
  modeHorsLigne = true;

  colis = [
    { code: 'TT-DKR-4839', destination: 'Saint-Louis', charge: true },
    { code: 'TT-DKR-4840', destination: 'Thiès',       charge: true },
    { code: 'TT-DKR-4842', destination: 'Diourbel',    charge: false },
  ];

  get progression(): number {
    return Math.round((this.colisCharges / this.totalColis) * 100);
  }

  constructor(private router: Router) {}

  validerEtDemarrer() {
    this.router.navigate(['/chauffeur/trajet']);
  }
}
