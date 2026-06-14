import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { ExpeditionResponse } from '../../../core/services/expedition';

@Component({
  selector: 'app-recapitulatif',
  imports: [CommonModule, RouterModule, ClientLayout],
  templateUrl: './recapitulatif.html',
  styleUrl: './recapitulatif.scss',
})
export class Recapitulatif implements OnInit{
  expedition: ExpeditionResponse | null = null;

  private router = inject(Router);

  ngOnInit() {
    const data = sessionStorage.getItem('expeditionEnCours');
    if (data) {
      this.expedition = JSON.parse(data);
    } else {
      this.router.navigate(['/client/expedition']);
    }
  }

  confirmerEtPayer() {
    this.router.navigate(['/client/paiement']);
  }

  modifier() {
    this.router.navigate(['/client/expedition']);
  }
}
