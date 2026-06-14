import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { ExpeditionResponse } from '../../../core/services/expedition';

@Component({
  selector: 'app-confirmation',
  imports: [CommonModule, RouterModule, ClientLayout],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.scss',
})
export class Confirmation implements OnInit {
  expedition: ExpeditionResponse | null = null;

  ngOnInit() {
    const data = sessionStorage.getItem('expeditionEnCours');
    if (data) {
      this.expedition = JSON.parse(data);
      sessionStorage.removeItem('expeditionEnCours');
    }
  }
}
