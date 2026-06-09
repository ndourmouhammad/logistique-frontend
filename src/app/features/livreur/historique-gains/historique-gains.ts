import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LivreurLayout } from '../../../shared/components/livreur-layout/livreur-layout';

@Component({
  selector: 'app-historique-gains',
  imports: [CommonModule, RouterModule, LivreurLayout],
  templateUrl: './historique-gains.html',
  styleUrl: './historique-gains.scss',
})
export class HistoriqueGains {
  ongletActif = 'livraisons';

  stats = {
    totalGenere:    142500,
    soldeDisponible: 45800,
    nbCourses:       86,
    taux:            98,
    cashCollecte:    45000
  };

  livraisons = [
    { code: 'DKR-4839', heure: '16:45', lieu: 'Almadies',  gain: 1200, succes: true,  date: "Aujourd'hui" },
    { code: 'DKR-4812', heure: '14:20', lieu: 'Plateau',   gain: 800,  succes: true,  date: "Aujourd'hui" },
    { code: 'DKR-4790', heure: '17:15', lieu: 'Médina',    gain: 1500, succes: true,  date: 'Hier' },
    { code: 'DKR-4785', heure: '15:30', lieu: 'Client absent', gain: 0, succes: false, date: 'Hier' },
  ];

  transactions = [
    { code: 'TT-DKR-4721', date: "Aujourd'hui 14:30", montant: 800,   credit: true },
    { code: 'TT-DKR-4610', date: 'Hier 16:15',        montant: 1200,  credit: true },
    { code: 'Retrait Wave', date: 'Lun. 04 Mai',       montant: 25000, credit: false },
  ];

  switchOnglet(onglet: string) {
    this.ongletActif = onglet;
  }
}
