import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';

@Component({
  selector: 'app-confirmation',
  imports: [CommonModule, RouterModule, ClientLayout],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.scss',
})
export class Confirmation {
  codeTracking = 'TT-DKR-4839';
  montant      = 3600;
  modePaiement = 'Wave';
}
