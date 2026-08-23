import { Component, OnInit, inject, effect, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HubLayout } from '../../../shared/components/hub-layout/hub-layout';
import { HubService } from '../../../core/services/hub';
import { HubContext } from '../../../core/services/hub-context';
import { ExpeditionListItem } from '../../../core/models/relais.model';

@Component({
  selector: 'app-dashboard-hub',
  imports: [HubLayout, CommonModule, RouterModule],
  templateUrl: './dashboard-hub.html',
  styleUrl: './dashboard-hub.scss',
})
export class DashboardHub implements OnInit {
  
  private hubService = inject(HubService);
  private hubContext = inject(HubContext);

  nomHub = computed(() => this.hubContext.hub()?.nom ?? 'Hub Dakar Nord');
  gestionnaire = 'GH';

  colisATrier = signal<ExpeditionListItem[]>([]);
  colisAttendus = signal<ExpeditionListItem[]>([]);
  stock = signal<ExpeditionListItem[]>([]);

  kpis = computed(() => {
    const stockCount = this.stock().length;
    const capaciteMax = 500;
    return {
      enAttente: this.colisATrier().length,
      enTransit: this.colisAttendus().length,
      livres: 0,
      capacite: capaciteMax > 0 ? Math.round((stockCount / capaciteMax) * 100) : 0
    };
  });

  expeditionsRecentes = computed(() => {
    return this.stock().slice(0, 10).map(s => ({
      code: s.codeTracking,
      destination: s.villeDestinataire,
      statut: s.statut,
      livreur: 'Non assigné' 
    }));
  });

  alertes: any[] = [];

  constructor() {
    effect(() => {
      if (this.hubContext.isLoaded()) {
        this.chargerDashboard();
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    this.hubContext.chargerHub();
  }

  chargerDashboard() {
    const hubId = this.hubContext.hubId;
    
    this.hubService.getExpeditionsATrier(hubId).subscribe(data => {
      this.colisATrier.set(data);
    });

    this.hubService.getColisAttendus(hubId).subscribe(data => {
      this.colisAttendus.set(data);
    });

    this.hubService.getStock(hubId).subscribe(data => {
      this.stock.set(data);
    });
  }
}
