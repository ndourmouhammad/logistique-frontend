import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { ExpeditionService } from '../../../core/services/expedition';
import { TrackingResponse } from '../../../core/services/expedition';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tracking',
  imports: [CommonModule, RouterModule, FormsModule, ClientLayout],
  templateUrl: './tracking.html',
  styleUrl: './tracking.scss',
})
export class Tracking implements OnInit{
  codeRecherche = '';
  tracking: TrackingResponse | null = null;
  isLoading     = false;
  erreur        = '';



  private expeditionService = inject(ExpeditionService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    // Si code passé en query param → tracker directement
    this.route.queryParams.subscribe(params => {
      if (params['code']) {
        this.codeRecherche = params['code'];
        this.rechercher();
      }
    });
  }

  rechercher() {
    if (!this.codeRecherche.trim()) return;

    this.isLoading = true;
    this.erreur    = '';
    this.tracking  = null;

    this.expeditionService.trackerExpedition(this.codeRecherche.trim()).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.tracking  = data;
      },
      error: () => {
        this.isLoading = false;
        this.erreur = 'Aucune expédition trouvée pour ce code.';
      }
    });
  }
}
