import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminLayout } from '../../../shared/components/admin-layout/admin-layout';
import { AdminService } from '../../../core/services/admin';
import { VehiculeAdmin, UtilisateurAdmin, VehiculeRequest } from '../../../core/models/admin.model';

@Component({
  selector: 'app-flotte',
  imports: [CommonModule, RouterModule, FormsModule, AdminLayout],
  templateUrl: './flotte.html',
  styleUrl: './flotte.scss',
})
export class Flotte implements OnInit {

  vehicules      = signal<VehiculeAdmin[]>([]);
  chauffeurs     = signal<UtilisateurAdmin[]>([]);
  isLoading      = signal(false);
  showModal      = signal(false);
  isCreating     = signal(false);
  erreurMessage  = signal('');
  successMessage = signal('');
  recherche      = signal('');

  typesVehicule  = ['CAMIONNETTE', 'VOITURE', 'MOTOCYCLE'];
  statutsVehicule = ['DISPONIBLE', 'EN_SERVICE', 'EN_MAINTENANCE', 'EN_PANNE'];

  form = signal<VehiculeRequest>({
    immatriculation: '', type: 'CAMIONNETTE',
    capaciteMaxPoids: 500, capaciteMaxVolume: 2.0,
    statut: 'DISPONIBLE', chauffeurId: undefined
  });

  vehiculesFiltres = computed(() => {
    const r = this.recherche().toLowerCase();
    return this.vehicules().filter(v =>
      v.immatriculation.toLowerCase().includes(r) ||
      v.type.toLowerCase().includes(r) ||
      (v.chauffeurNom && v.chauffeurNom.toLowerCase().includes(r))
    );
  });

  private adminService = inject(AdminService);

  ngOnInit() { this.chargerDonnees(); }

  chargerDonnees() {
    this.isLoading.set(true);
    this.adminService.getVehicules().subscribe({
      next: (data) => { this.isLoading.set(false); this.vehicules.set(data); },
      error: () => this.isLoading.set(false)
    });
    // Charger les chauffeurs pour l'assignation
    this.adminService.getUtilisateurs().subscribe({
      next: (data) => {
        this.chauffeurs.set(data.filter(u => u.role === 'ROLE_CHAUFFEUR'));
      }
    });
  }

  ouvrirModal() {
    this.form.set({
      immatriculation: '', type: 'CAMIONNETTE',
      capaciteMaxPoids: 500, capaciteMaxVolume: 2.0,
      statut: 'DISPONIBLE', chauffeurId: undefined
    });
    this.erreurMessage.set('');
    this.showModal.set(true);
  }

  fermerModal() { this.showModal.set(false); }

  updateForm(field: string, value: any) {
    this.form.update(f => ({ ...f, [field]: value }));
  }

  creerVehicule() {
    const f = this.form();
    if (!f.immatriculation) {
      this.erreurMessage.set("L'immatriculation est requise.");
      return;
    }

    this.isCreating.set(true);
    this.erreurMessage.set('');

    this.adminService.creerVehicule(f).subscribe({
      next: () => {
        this.isCreating.set(false);
        this.showModal.set(false);
        this.successMessage.set('Véhicule ajouté avec succès.');
        this.chargerDonnees();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        this.isCreating.set(false);
        this.erreurMessage.set(
          err.error?.includes('immatriculation')
            ? 'Cette immatriculation existe déjà.'
            : 'Erreur lors de la création.'
        );
      }
    });
  }

  getStatutClass(statut: string): string {
    const map: Record<string, string> = {
      'DISPONIBLE':     'bg-emerald-50 text-emerald-700 border-emerald-100',
      'EN_SERVICE':     'bg-blue-50 text-blue-700 border-blue-100',
      'EN_MAINTENANCE': 'bg-orange-50 text-orange-700 border-orange-100',
      'EN_PANNE':       'bg-red-50 text-red-700 border-red-100',
    };
    return map[statut] || 'bg-slate-50 text-slate-500 border-slate-100';
  }

  getTypeIcon(type: string): string {
    const map: Record<string, string> = {
      'CAMIONNETTE': 'ti-truck',
      'VOITURE':     'ti-car',
      'MOTOCYCLE':   'ti-motorbike',
    };
    return map[type] || 'ti-vehicle';
  }
}