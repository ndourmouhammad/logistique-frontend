import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';

@Component({
  selector: 'app-tracking',
  imports: [CommonModule, RouterModule, ClientLayout],
  templateUrl: './tracking.html',
  styleUrl: './tracking.scss',
})
export class Tracking {
  codeTracking = 'TT-DKR-4839';
  codeRecherche = '';

  etapes = [
    { statut: 'CREE',              label: 'Expédition créée & payée',  heure: 'Auj. 09h15', done: true },
    { statut: 'EN_COURS_RAMASSAGE', label: 'Ramassage effectué',       heure: 'Auj. 10h30', done: true },
    { statut: 'RECU_AU_HUB',        label: 'Arrivée au hub Dakar',     heure: 'Auj. 11h42', done: true },
    { statut: 'EN_COURS_LIVRAISON', label: 'En cours de livraison',    heure: 'Auj. 14h07', done: false, current: true },
    { statut: 'LIVRE',              label: 'Livré au destinataire',    heure: 'ETA 16h45',  done: false },
  ];
}
