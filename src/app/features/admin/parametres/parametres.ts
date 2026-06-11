import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminLayout } from '../../../shared/components/admin-layout/admin-layout';

@Component({
  selector: 'app-parametres',
  imports: [CommonModule, RouterModule, FormsModule, AdminLayout],
  templateUrl: './parametres.html',
  styleUrl: './parametres.scss',
})
export class Parametres {
  ongletActif = 'tarification';

  tarifs = {
    prixBase:         1500,
    prixParKg:         200,
    prixParM3:        5000,
    multiplicateurExpress: 1.8,
    tauxAssurance:    0.02,
  };

  zones = [
    { nom: 'Dakar métropole',     tarif: 1500, delai: '2-4h' },
    { nom: 'Grande banlieue',     tarif: 2000, delai: '4-6h' },
    { nom: 'Inter-hub régional',  tarif: 3500, delai: '24h' },
    { nom: 'Longue distance',     tarif: 5000, delai: '48h' },
  ];

  sauvegarder() {
    console.log('Sauvegarde paramètres', this.tarifs);
    // TODO : appel API
  }
}
