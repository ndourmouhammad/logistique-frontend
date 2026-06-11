import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminLayout } from '../../../shared/components/admin-layout/admin-layout';

@Component({
  selector: 'app-incidents',
  imports: [CommonModule, RouterModule, AdminLayout],
  templateUrl: './incidents.html',
  styleUrl: './incidents.scss',
})
export class Incidents {
  selectedIncidentId: number | null = 1;
  incidents = [
    {
      id: 1,
      type: 'SOS',
      acteur: 'Omar Diagne (Chauffeur)',
      localisation: 'Route Dakar-Thiès, km 45',
      heure: '08h32',
      statut: 'ACTIF',
      description: 'Accident de la route — camion DK-1234-A immobilisé'
    },
    {
      id: 2,
      type: 'PANNE',
      acteur: 'Ibrahima Balde (Livreur)',
      localisation: 'Almadies, Zone 12',
      heure: '11h15',
      statut: 'ACTIF',
      description: 'Panne moto — colis non livré TT-DKR-4839'
    },
    {
      id: 3,
      type: 'ANOMALIE',
      acteur: 'Hub Thiès',
      localisation: 'Hub Thiès',
      heure: '09h00',
      statut: 'RESOLU',
      description: 'Colis endommagé à la réception — TT-DKR-4721'
    },
  ];

  getTypeClass(type: string): string {
    const map: Record<string, string> = {
      'SOS':      'bg-red-100 text-red-700',
      'PANNE':    'bg-orange-100 text-orange-700',
      'ANOMALIE': 'bg-yellow-100 text-yellow-700',
    };
    return map[type] || 'bg-slate-100 text-slate-600';
  }

  resoudreIncident(id: number) {
    const inc = this.incidents.find(i => i.id === id);
    if (inc) inc.statut = 'RESOLU';
  }
}
