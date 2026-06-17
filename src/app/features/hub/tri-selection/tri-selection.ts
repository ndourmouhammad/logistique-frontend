import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HubLayout } from '../../../shared/components/hub-layout/hub-layout';
import { ExpeditionListItem, HubService } from '../../../core/services/hub';

@Component({
  selector: 'app-tri-selection',
  imports: [HubLayout, CommonModule, RouterModule, FormsModule],
  templateUrl: './tri-selection.html',
  styleUrl: './tri-selection.scss',
})
export class TriSelection implements OnInit {
  hubId = 1;

  // ── Signals au lieu de propriétés classiques ─────────────────────────────
  colis = signal<ExpeditionListItem[]>([]);
  colisSelectionnes = signal<number[]>([]);
  isLoading = signal(false);

  private hubService = inject(HubService);
  private router = inject(Router);

  ngOnInit() {
    this.chargerExpeditions();
  }

  chargerExpeditions() {
    this.isLoading.set(true);
    this.hubService.getExpeditionsATrier(this.hubId).subscribe({
      next: (data) => {
        this.isLoading.set(false);
        this.colis.set(data);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  toggleSelection(id: number) {
    const current = this.colisSelectionnes();
    const idx = current.indexOf(id);
    if (idx === -1) {
      this.colisSelectionnes.set([...current, id]);
    } else {
      this.colisSelectionnes.set(current.filter((c) => c !== id));
    }
  }

  estSelectionne(id: number): boolean {
    return this.colisSelectionnes().includes(id);
  }

  suivant() {
    if (this.colisSelectionnes().length === 0) return;
    sessionStorage.setItem('colisSelectionnes', JSON.stringify(this.colisSelectionnes()));
    this.router.navigate(['/hub/preparation']);
  }
}
