import { Component, inject, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HubLayout } from '../../../shared/components/hub-layout/hub-layout';
import { HubService } from '../../../core/services/hub';
import { HubContext } from '../../../core/services/hub-context';
import { ExpeditionListItem } from '../../../core/models/relais.model';

@Component({
  selector: 'app-plan-hub',
  imports: [HubLayout, CommonModule, RouterModule, FormsModule],
  templateUrl: './plan-hub.html',
  styleUrl: './plan-hub.scss',
})
export class PlanHub implements OnInit {

  stock = signal<ExpeditionListItem[]>([]);
  isLoading = signal(false);

  // ── Pagination ──────────────────────────────────────────────────────────
  page = signal(1);
  pageSize = 10;

  // ── Filtres (désactivés pour l'instant, zones commentées) ──────────────
  // zones mockées — utilisées uniquement par le bloc @if(false)
  zones = [
    { code: 'A', nom: 'Zone A — Express',   nbColis: 0, capacite: 80,  couleur: 'bg-indigo-500' },
    { code: 'B', nom: 'Zone B — Standard',  nbColis: 0, capacite: 150, couleur: 'bg-emerald-500' },
    { code: 'C', nom: 'Zone C — Fragile',   nbColis: 0, capacite: 50,  couleur: 'bg-orange-500' },
    { code: 'D', nom: 'Zone D — Inter-Hub', nbColis: 0, capacite: 100, couleur: 'bg-purple-500' },
  ];

  private hubContext = inject(HubContext);
  private hubService = inject(HubService);

  constructor() {
    effect(() => {
      if (this.hubContext.isLoaded()) {
        this.chargerStock();
      }
    });
  }

  ngOnInit() {
    this.hubContext.chargerHub();
  }

  // ── Données dérivées ───────────────────────────────────────────────────
  get colisStockes(): number {
    return this.stock().length;
  }

  get capaciteTotale(): number {
    return 500; // Valeur par défaut, pourra venir du backend plus tard
  }

  get tauxOccupation(): number {
    return this.capaciteTotale > 0 ? Math.round((this.colisStockes / this.capaciteTotale) * 100) : 0;
  }

  get nomHub(): string {
    return this.hubContext.hub()?.nom ?? 'Hub';
  }

  // ── Pagination computed ────────────────────────────────────────────────
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.colisStockes / this.pageSize));
  }

  get pagesArray(): number[] {
    const total = this.totalPages;
    const current = this.page();
    const pages: number[] = [];

    // Afficher max 5 pages autour de la page courante
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);
    start = Math.max(1, end - 4);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  get stockPage(): ExpeditionListItem[] {
    const start = (this.page() - 1) * this.pageSize;
    return this.stock().slice(start, start + this.pageSize);
  }

  get debutAffichage(): number {
    return (this.page() - 1) * this.pageSize + 1;
  }

  get finAffichage(): number {
    return Math.min(this.page() * this.pageSize, this.colisStockes);
  }

  // ── Actions ────────────────────────────────────────────────────────────
  chargerStock() {
    this.isLoading.set(true);
    this.hubService.getStock(this.hubContext.hubId).subscribe({
      next: (data) => {
        this.stock.set(data);
        this.isLoading.set(false);
        // Reset page si on dépasse
        if (this.page() > this.totalPages) {
          this.page.set(1);
        }
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  allerPage(p: number) {
    if (p >= 1 && p <= this.totalPages) {
      this.page.set(p);
    }
  }

  // ── Calcul de la durée de stockage ─────────────────────────────────────
  dureeStock(dateReception: string | null): string {
    if (!dateReception) return '—';

    const now = new Date();
    const reception = new Date(dateReception);
    const diffMs = now.getTime() - reception.getTime();

    if (diffMs < 0) return '—';

    const minutes = Math.floor(diffMs / 60000);
    const heures = Math.floor(minutes / 60);
    const jours = Math.floor(heures / 24);

    if (jours > 0) return `${jours}j ${heures % 24}h`;
    if (heures > 0) return `${heures}h${minutes % 60 > 0 ? (minutes % 60) + 'min' : ''}`;
    return `${minutes} min`;
  }

  // ── Déterminer si un colis est "en retard" (> 24h en stock) ────────────
  estEnRetard(dateReception: string | null): boolean {
    if (!dateReception) return false;
    const diffMs = new Date().getTime() - new Date(dateReception).getTime();
    return diffMs > 24 * 60 * 60 * 1000; // Plus de 24h
  }

  // ── Label statut lisible ───────────────────────────────────────────────
  labelStatut(colis: ExpeditionListItem): string {
    if (this.estEnRetard(colis.dateReception)) return 'En retard';
    if (colis.statut === 'RECU_AU_HUB') return 'En stock';
    return colis.statut;
  }
}
