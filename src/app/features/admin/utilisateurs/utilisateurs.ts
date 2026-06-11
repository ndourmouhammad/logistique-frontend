import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminLayout } from '../../../shared/components/admin-layout/admin-layout';

@Component({
  selector: 'app-utilisateurs',
  imports: [CommonModule, RouterModule, FormsModule, AdminLayout],
  templateUrl: './utilisateurs.html',
  styleUrl: './utilisateurs.scss',
})
export class Utilisateurs {
  recherche  = '';
  filtreRole = 'tous';

  utilisateurs = [
    { id: 1, nom: 'Ibrahima Balde',  email: 'ibrahima@tiaktiak.sn', role: 'ROLE_LIVREUR',          statut: 'ACTIF',    dateInscription: '12/03/2026' },
    { id: 2, nom: 'Fatou Diallo',    email: 'fatou@tiaktiak.sn',    role: 'ROLE_CLIENT',            statut: 'ACTIF',    dateInscription: '05/04/2026' },
    { id: 3, nom: 'Omar Diagne',     email: 'omar@tiaktiak.sn',     role: 'ROLE_CHAUFFEUR',         statut: 'ACTIF',    dateInscription: '18/02/2026' },
    { id: 4, nom: 'Awa Ndour',       email: 'awa@tiaktiak.sn',      role: 'ROLE_GERANT_RELAIS',     statut: 'ACTIF',    dateInscription: '01/05/2026' },
    { id: 5, nom: 'Ibou Sarr',       email: 'ibou@tiaktiak.sn',     role: 'ROLE_GESTIONNAIRE_HUB', statut: 'ACTIF',    dateInscription: '22/01/2026' },
    { id: 6, nom: 'Cheikh Fall',     email: 'cheikh@tiaktiak.sn',   role: 'ROLE_CHAUFFEUR',         statut: 'SUSPENDU', dateInscription: '10/03/2026' },
  ];

  roles = ['tous', 'ROLE_CLIENT', 'ROLE_LIVREUR', 'ROLE_CHAUFFEUR', 'ROLE_GESTIONNAIRE_HUB', 'ROLE_GERANT_RELAIS'];

  get utilisateursFiltres() {
    return this.utilisateurs.filter(u => {
      const matchRecherche = u.nom.toLowerCase().includes(this.recherche.toLowerCase())
        || u.email.toLowerCase().includes(this.recherche.toLowerCase());
      const matchRole = this.filtreRole === 'tous' || u.role === this.filtreRole;
      return matchRecherche && matchRole;
    });
  }

  getRoleLabel(role: string): string {
    const map: Record<string, string> = {
      'ROLE_CLIENT':           'Client',
      'ROLE_LIVREUR':          'Livreur',
      'ROLE_CHAUFFEUR':        'Chauffeur',
      'ROLE_GESTIONNAIRE_HUB':'Gestionnaire Hub',
      'ROLE_GERANT_RELAIS':   'Gérant Relais',
      'ROLE_ADMIN':            'Admin',
    };
    return map[role] || role;
  }

  toggleStatut(id: number) {
    const u = this.utilisateurs.find(u => u.id === id);
    if (u) u.statut = u.statut === 'ACTIF' ? 'SUSPENDU' : 'ACTIF';
  }
}
