// paiement-echec.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';

@Component({
  selector: 'app-paiement-echec',
  imports: [CommonModule, RouterModule, ClientLayout],
  templateUrl: './paiement-echec.html',
})
export class PaiementEchec {}