import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LivreurLayout } from '../../../shared/components/livreur-layout/livreur-layout';

@Component({
  selector: 'app-depot-hub',
  imports: [CommonModule, RouterModule, LivreurLayout],
  templateUrl: './depot-hub.html',
  styleUrl: './depot-hub.scss',
})
export class DepotHub {
  showQrModal = false;
  nbColis = 14;
  nomHub  = 'Hub Dakar Nord';

  colis = [
    { code: 'TT-DKR-4839', heure: '14:32', lieu: 'Almadies' },
    { code: 'TT-DKR-4840', heure: '15:10', lieu: 'Yoff' },
    { code: 'TT-DKR-4845', heure: '16:05', lieu: 'Ngor' },
  ];
}
