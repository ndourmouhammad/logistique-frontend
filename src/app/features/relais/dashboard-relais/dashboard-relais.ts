import { Component, OnInit, OnDestroy, inject, effect, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RelaisLayout } from '../../../shared/components/relais-layout/relais-layout';
import { RelaisService } from '../../../core/services/relais';
import { RelaisContext } from '../../../core/services/relais-context';
import { ExpeditionListItem, CommissionResponse } from '../../../core/models/relais.model';

@Component({
  selector: 'app-dashboard-relais',
  imports: [CommonModule, RouterModule, RelaisLayout],
  templateUrl: './dashboard-relais.html',
  styleUrl: './dashboard-relais.scss',
})
export class DashboardRelais implements OnInit, OnDestroy {
  nomRelais = signal('Boutique — Dakar');
  currentDate = signal(new Date());
  timer: any;

  stock = signal<ExpeditionListItem[]>([]);
  commissions = signal<CommissionResponse[]>([]);

  kpis = computed(() => ({
    enStock: this.stock().length,
    attendusJour: 0,
    remisJour: 0,
    commissionMois: this.commissions().reduce((sum, c) => sum + c.montant, 0)
  }));

  colisEnStock = computed(() => {
    return this.stock().map(s => ({
      code: s.codeTracking,
      destinataire: s.nomDestinataire,
      statut: 'OK', 
      depuis: s.dateReception ? new Date(s.dateReception).toLocaleDateString() : 'Aujourd\'hui'
    }));
  });

  private relaisService = inject(RelaisService);
  private relaisContext = inject(RelaisContext);

  constructor() {
    effect(() => {
      if (this.relaisContext.isLoaded()) {
        this.nomRelais.set(`${this.relaisContext.nomEnseigne} — ${this.relaisContext.villeRelais}`);
        this.chargerDashboard();
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    this.timer = setInterval(() => {
      this.currentDate.set(new Date());
    }, 60000);
    this.relaisContext.chargerRelais();
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  chargerDashboard() {
    const relaisId = this.relaisContext.relaisId;
    
    // Charger le stock
    this.relaisService.getStock(relaisId).subscribe({
      next: (stock) => {
        this.stock.set(stock);
      }
    });

    // Charger les commissions
    this.relaisService.getCommissions(relaisId).subscribe({
      next: (commissions) => {
        this.commissions.set(commissions);
      }
    });
  }
}
