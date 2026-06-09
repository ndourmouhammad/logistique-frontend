import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-accueil',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './accueil.html',
  styleUrl: './accueil.scss',
})
export class Accueil {
  villeDepart  = 'Dakar';
  villeArrivee = 'Saint-Louis';
  poids        = 2.5;
  service      = 'Standard';
  estimation   = 2500;
  mobileMenuOpen = false;

  villes = ['Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 'Mbour'];

  constructor(private router: Router) {}

  calculerEstimation() {
    const base = 1500 + (this.poids * 400) + (this.service === 'Express' ? 800 : 0);
    this.estimation = Math.round(base);
  }

  creerExpedition() {
    this.router.navigate(['/client/expedition']);
  }
}
