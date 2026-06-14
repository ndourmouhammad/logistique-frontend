import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { ExpeditionResponse, ExpeditionService } from '../../../core/services/expedition';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-historique',
  imports: [CommonModule, RouterModule, FormsModule, ClientLayout],
  templateUrl: './historique.html',
  styleUrl: './historique.scss',
})
export class Historique implements OnInit{
  expeditions: ExpeditionResponse[] = [];
  isLoading    = false;
  recherche    = '';
  filtreStatut = 'tous';

  private expeditionService = inject(ExpeditionService);
  private authService = inject(Auth);

  ngOnInit() {
    this.chargerHistorique();
  }

  chargerHistorique() {
    const clientId = this.authService.getUserId();
    if (!clientId) return;

    this.isLoading = true;
    this.expeditionService.getHistoriqueClient(clientId).subscribe({
      next: (data) => {
        this.isLoading  = false;
        this.expeditions = data;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  get expeditionsFiltrees() {
    return this.expeditions.filter(e => {
      const matchRecherche = e.codeTracking.toLowerCase()
        .includes(this.recherche.toLowerCase())
        || e.villeDestinataire?.toLowerCase()
        .includes(this.recherche.toLowerCase());
      const matchStatut = this.filtreStatut === 'tous'
        || e.statut === this.filtreStatut;
      return matchRecherche && matchStatut;
    });
  }

  getStatutClass(statut: string): string {
    const map: Record<string, string> = {
      'CREE':               'bg-purple-50 text-purple-700',
      'EN_COURS_RAMASSAGE': 'bg-blue-50 text-blue-700',
      'RECU_AU_HUB':        'bg-indigo-50 text-indigo-700',
      'EN_TRANSIT':         'bg-orange-50 text-orange-700',
      'EN_COURS_LIVRAISON': 'bg-yellow-50 text-yellow-700',
      'LIVRE':              'bg-emerald-50 text-emerald-700',
      'RETOURNE':           'bg-red-50 text-red-700',
      'EN_LITIGE':          'bg-red-100 text-red-800',
    };
    return map[statut] || 'bg-slate-50 text-slate-500';
  }
}
