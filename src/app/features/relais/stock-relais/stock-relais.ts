import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RelaisLayout } from '../../../shared/components/relais-layout/relais-layout';
import { ExpeditionListItem } from '../../../core/services/hub';
import { RelaisService } from '../../../core/services/relais';

@Component({
  selector: 'app-stock-relais',
  imports: [CommonModule, RouterModule, FormsModule, RelaisLayout],
  templateUrl: './stock-relais.html',
  styleUrl: './stock-relais.scss',
})
export class StockRelais implements OnInit{
  stock         = signal<ExpeditionListItem[]>([]);
  recherche     = signal('');
  isLoading     = signal(false);
  erreurMessage = signal('');

  relaisId = 5;

  stockFiltre = computed(() => {
    const recherche = this.recherche().toLowerCase();
    return this.stock().filter(c =>
      c.codeTracking.toLowerCase().includes(recherche)
      || c.nomDestinataire.toLowerCase().includes(recherche)
    );
  });

  private relaisService = inject(RelaisService);

  ngOnInit() {
    this.chargerStock();
  }

  chargerStock() {
    this.isLoading.set(true);
    this.relaisService.getStock(this.relaisId).subscribe({
      next: (data) => {
        this.isLoading.set(false);
        this.stock.set(data);
      },
      error: () => {
        this.isLoading.set(false);
        this.erreurMessage.set('Erreur lors du chargement du stock.');
      }
    });
  }

  onRechercheChange(value: string) {
    this.recherche.set(value);
  }
}
