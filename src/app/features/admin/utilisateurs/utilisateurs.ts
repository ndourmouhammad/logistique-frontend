import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminLayout } from '../../../shared/components/admin-layout/admin-layout';
import { AdminService } from '../../../core/services/admin';
import { HubAdmin, RelaisAdmin, CreateEmployeRequest, UtilisateurAdmin } from '../../../core/models/admin.model';

@Component({
  selector: 'app-utilisateurs',
  imports: [CommonModule, RouterModule, FormsModule, AdminLayout],
  templateUrl: './utilisateurs.html',
  styleUrl: './utilisateurs.scss',
})
export class Utilisateurs implements OnInit {

  utilisateurs  = signal<UtilisateurAdmin[]>([]);
  hubs          = signal<HubAdmin[]>([]);
  relais        = signal<RelaisAdmin[]>([]);
  isLoading     = signal(false);
  showModal     = signal(false);
  isCreating    = signal(false);
  erreurMessage = signal('');
  successMessage = signal('');

  recherche  = signal('');
  filtreRole = signal('tous');

  roles = ['tous', 'ROLE_CLIENT', 'ROLE_LIVREUR', 'ROLE_CHAUFFEUR',
           'ROLE_GESTIONNAIRE_HUB', 'ROLE_GERANT_RELAIS', 'ROLE_ADMIN'];

  // Formulaire création employé
  form = signal({
    nomComplet:   '',
    email:        '',
    telephone:    '',
    role:         'ROLE_LIVREUR',
    zoneAction:   '',
    numeroPermis: '',
    hubId:        null as number | null,
    relaisId:     null as number | null,
  });

  utilisateursFiltres = computed(() => {
    const r = this.recherche().toLowerCase();
    const role = this.filtreRole();
    return this.utilisateurs().filter(u => {
      const matchR = u.nomComplet.toLowerCase().includes(r)
                  || u.email.toLowerCase().includes(r);
      const matchRole = role === 'tous' || u.role === role;
      return matchR && matchRole;
    });
  });

  private adminService = inject(AdminService);

  ngOnInit() {
    this.chargerDonnees();
  }

  chargerDonnees() {
    this.isLoading.set(true);
    this.adminService.getUtilisateurs().subscribe({
      next: (data) => {
        this.isLoading.set(false);
        this.utilisateurs.set(data);
      },
      error: () => this.isLoading.set(false)
    });

    // Charger hubs et relais pour le formulaire de création
    this.adminService.getHubs().subscribe(data => this.hubs.set(data));
    this.adminService.getRelais().subscribe(data => this.relais.set(data));
  }

  ouvrirModal() {
    this.form.set({
      nomComplet: '', email: '', telephone: '',
      role: 'ROLE_LIVREUR', zoneAction: '', numeroPermis: '',
      hubId: null, relaisId: null
    });
    this.erreurMessage.set('');
    this.showModal.set(true);
  }

  fermerModal() { this.showModal.set(false); }

  updateForm(field: string, value: any) {
    this.form.update(f => ({ ...f, [field]: value }));
  }

  creerEmploye() {
    const f = this.form();
    if (!f.nomComplet || !f.email || !f.telephone) {
      this.erreurMessage.set('Nom, email et téléphone sont requis.');
      return;
    }

    this.isCreating.set(true);
    this.erreurMessage.set('');

    const request: CreateEmployeRequest = {
      nomComplet:   f.nomComplet,
      email:        f.email,
      telephone:    '+221' + f.telephone,
      role:         f.role,
      zoneAction:   f.zoneAction || undefined,
      numeroPermis: f.numeroPermis || undefined,
      hubId:        f.hubId || undefined,
      relaisId:     f.relaisId || undefined,
    };

    this.adminService.creerEmploye(request).subscribe({
      next: () => {
        this.isCreating.set(false);
        this.showModal.set(false);
        this.successMessage.set('Employé créé — identifiants envoyés par email.');
        this.chargerDonnees();
        setTimeout(() => this.successMessage.set(''), 4000);
      },
      error: (err) => {
        this.isCreating.set(false);
        this.erreurMessage.set(
          err.error?.includes('email') ? 'Cet email est déjà utilisé.' : 'Erreur serveur.'
        );
      }
    });
  }

  toggleStatut(id: number) {
    this.adminService.toggleStatut(id).subscribe({
      next: () => {
        this.utilisateurs.update(list =>
          list.map(u => u.id === id ? { ...u, actif: !u.actif } : u)
        );
      },
      error: () => {}
    });
  }

  getRoleLabel(role: string): string {
    const map: Record<string, string> = {
      'ROLE_CLIENT':           'Client',
      'ROLE_LIVREUR':          'Livreur',
      'ROLE_CHAUFFEUR':        'Chauffeur',
      'ROLE_GESTIONNAIRE_HUB': 'Gestionnaire Hub',
      'ROLE_GERANT_RELAIS':    'Gérant Relais',
      'ROLE_ADMIN':            'Admin',
    };
    return map[role] || role;
  }
}