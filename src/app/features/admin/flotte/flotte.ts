import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminLayout } from '../../../shared/components/admin-layout/admin-layout';

@Component({
  selector: 'app-flotte',
  imports: [CommonModule, RouterModule, FormsModule, AdminLayout],
  templateUrl: './flotte.html',
  styleUrl: './flotte.scss',
})
export class Flotte {
  filtreType   = 'tous';
  filtreStatut = 'tous';
  isModalOpen  = false;

  vehicules = [
    { immat: 'DK-1234-A', type: 'CAMION',   chauffeur: 'Omar Diagne',   statut: 'EN_ROUTE',     km: 185, charge: 48 },
    { immat: 'DK-5678-B', type: 'CAMION',   chauffeur: 'Modou Diagne',  statut: 'DISPONIBLE',   km: 0,   charge: 0 },
    { immat: 'MT-001',    type: 'MOTOCYCLE', chauffeur: 'Ibrahima B.',   statut: 'EN_ROUTE',     km: 4,   charge: 3 },
    { immat: 'MT-002',    type: 'MOTOCYCLE', chauffeur: 'Amadou Sow',    statut: 'DISPONIBLE',   km: 0,   charge: 0 },
    { immat: 'MT-003',    type: 'MOTOCYCLE', chauffeur: '—',             statut: 'EN_MAINTENANCE',km: 0,  charge: 0 },
    { immat: 'DK-9999-C', type: 'CAMIONNETTE',chauffeur: '—',           statut: 'EN_PANNE',     km: 0,   charge: 0 },
  ];

  get vehiculesFiltres() {
    return this.vehicules.filter(v => {
      const matchType   = this.filtreType   === 'tous' || v.type   === this.filtreType;
      const matchStatut = this.filtreStatut === 'tous' || v.statut === this.filtreStatut;
      return matchType && matchStatut;
    });
  }

  getStatutClass(statut: string): string {
    const map: Record<string, string> = {
      'EN_ROUTE':       'bg-blue-50 text-blue-700',
      'DISPONIBLE':     'bg-emerald-50 text-emerald-700',
      'EN_MAINTENANCE': 'bg-orange-50 text-orange-700',
      'EN_PANNE':       'bg-red-50 text-red-700',
    };
    return map[statut] || 'bg-slate-50 text-slate-500';
  }
}
