import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-scan-enlevement',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './scan-enlevement.html',
  styleUrl: './scan-enlevement.scss',
})
export class ScanEnlevement {
  codeSaisi    = '';
  scanReussi   = false;
  codeTrouve   = '';

  constructor(private router: Router) {}

  confirmerScan() {
    if (this.codeSaisi.trim()) {
      this.codeTrouve  = this.codeSaisi.toUpperCase();
      this.scanReussi  = true;
    }
  }

  // Démo — simuler un scan réussi
  simulerScan() {
    this.codeTrouve = 'TT-DKR-4839';
    this.scanReussi = true;
  }

  confirmerPriseEnCharge() {
    this.router.navigate(['/livreur/itineraire']);
  }
}
