import { Component, inject, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HubLayout } from '../../../shared/components/hub-layout/hub-layout';
import { HubService } from '../../../core/services/hub';
import { ExpeditionListItem } from '../../../core/models/relais.model';
import { HubContext } from '../../../core/services/hub-context';

@Component({
  selector: 'app-tri-selection',
  imports: [HubLayout, CommonModule, RouterModule, FormsModule],
  templateUrl: './tri-selection.html',
  styleUrl: './tri-selection.scss',
})
export class TriSelection implements OnInit {
  colis = signal<ExpeditionListItem[]>([]);
  colisSelectionnes = signal<number[]>([]);
  isLoading = signal(false);

  private hubContext = inject(HubContext);
  private hubService = inject(HubService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (this.hubContext.isLoaded()) {
        this.chargerExpeditions();
      }
    });
  }

  ngOnInit() {
    this.hubContext.chargerHub();
  }

  chargerExpeditions() {
    this.isLoading.set(true);
    this.hubService.getExpeditionsATrier(this.hubContext.hubId).subscribe({
      next: (data) => {
        this.isLoading.set(false);
        this.colis.set(data);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  // ── Détermine la ville de destination réelle selon le mode ────────────────
  villeDestinationReelle(c: ExpeditionListItem): string {
    if (c.modeLivraison === 'RETRAIT_RELAIS' && c.villePointRelais) {
      return c.villePointRelais;
    }
    return c.villeDestinataire;
  }

  // ── Détermine le type d'action pour chaque colis ──────────────────────────
  typeAction(c: ExpeditionListItem): 'DEPOT_RELAIS' | 'CHAUFFEUR' | 'LIVREUR' {
  if (c.modeLivraison === 'RETRAIT_RELAIS') {
    const villeDestination = c.villePointRelais ?? c.villeDestinataire;
    if (villeDestination.toLowerCase() === this.hubContext.villeHub.toLowerCase()) {
      return 'DEPOT_RELAIS';
    } else {
      return 'CHAUFFEUR'; // ← Diourbel ≠ Dakar → doit retourner ici
    }
  }
  if (this.villeDestinationReelle(c).toLowerCase() !== this.hubContext.villeHub.toLowerCase()) {
    return 'CHAUFFEUR';
  }
  return 'LIVREUR';
}

  toggleSelection(id: number) {
    const current = this.colisSelectionnes();
    const idx = current.indexOf(id);
    if (idx === -1) {
      this.colisSelectionnes.set([...current, id]);
    } else {
      this.colisSelectionnes.set(current.filter(c => c !== id));
    }
  }

  estSelectionne(id: number): boolean {
    return this.colisSelectionnes().includes(id);
  }

  // ── Les colis sélectionnés sont-ils homogènes ? ──
  colisSelectionnesData = computed(() =>
    this.colis().filter(c => this.colisSelectionnes().includes(c.id))
  );

  typeSuggere = computed(() => {
    const selection = this.colisSelectionnesData();
    if (selection.length === 0) return null;

    const types = selection.map(c => this.typeAction(c));
    const tousIdentiques = types.every(t => t === types[0]);

    if (tousIdentiques) return types[0];
    return 'MIXTE';
  });

  suivant() {
    if (this.colisSelectionnes().length === 0) return;

    const type = this.typeSuggere();
    sessionStorage.setItem('colisSelectionnes', JSON.stringify(this.colisSelectionnes()));

    if (type === 'CHAUFFEUR')          this.router.navigate(['/hub/depart-chauffeur']);
    else if (type === 'LIVREUR')       this.router.navigate(['/hub/preparation']);
    else if (type === 'DEPOT_RELAIS')  this.router.navigate(['/hub/depot-relais']);
  }
}