import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminLayout } from '../../../shared/components/admin-layout/admin-layout';
import { AdminService } from '../../../core/services/admin';
import { RelaisAdmin, RelaisRequest } from '../../../core/models/admin.model';

@Component({
  selector: 'app-relais-admin',
  imports: [CommonModule, RouterModule, FormsModule, AdminLayout],
  templateUrl: './admin-relais.html',
  styleUrl: './admin-relais.scss',
})
export class AdminRelais implements OnInit {

  relais         = signal<RelaisAdmin[]>([]);
  isLoading      = signal(false);
  showModal      = signal(false);
  isCreating     = signal(false);
  erreurMessage  = signal('');
  successMessage = signal('');
  recherche      = signal('');

  editingRelaisId = signal<number | null>(null);
  isEditMode      = signal(false);

  form = signal<RelaisRequest>({
    nomEnseigne: '', capaciteMaxColis: 50,
    tauxCommissionParColis: 250,
    rue: '', ville: '', region: ''
  });

  relaisFiltres = computed(() => {
    const r = this.recherche().toLowerCase();
    return this.relais().filter(p =>
      p.nomEnseigne.toLowerCase().includes(r) ||
      p.ville.toLowerCase().includes(r)
    );
  });

  private adminService = inject(AdminService);

  ngOnInit() { this.chargerRelais(); }

  chargerRelais() {
    this.isLoading.set(true);
    this.adminService.getRelais().subscribe({
      next: (data) => { this.isLoading.set(false); this.relais.set(data); },
      error: () => this.isLoading.set(false)
    });
  }

  ouvrirModal() {
    this.isEditMode.set(false);
    this.editingRelaisId.set(null);
    this.form.set({
      nomEnseigne: '', capaciteMaxColis: 50,
      tauxCommissionParColis: 250,
      rue: '', ville: '', region: ''
    });
    this.erreurMessage.set('');
    this.showModal.set(true);
  }

  ouvrirModalEdition(relais: RelaisAdmin) {
    this.isEditMode.set(true);
    this.editingRelaisId.set(relais.id);
    this.form.set({
      nomEnseigne: relais.nomEnseigne,
      capaciteMaxColis: relais.capaciteMaxColis || 50,
      tauxCommissionParColis: relais.tauxCommissionParColis || 250,
      rue: relais.rue || '',
      ville: relais.ville || '',
      region: relais.region || ''
    });
    this.erreurMessage.set('');
    this.showModal.set(true);
  }

  fermerModal() { this.showModal.set(false); }

  updateForm(field: string, value: any) {
    this.form.update(f => ({ ...f, [field]: value }));
  }

  sauvegarderRelais() {
    const f = this.form();
    if (!f.nomEnseigne || !f.ville) {
      this.erreurMessage.set('Le nom et la ville sont requis.');
      return;
    }

    this.isCreating.set(true);
    this.erreurMessage.set('');

    const operation = this.isEditMode() && this.editingRelaisId()
      ? this.adminService.modifierRelais(this.editingRelaisId()!, f)
      : this.adminService.creerRelais(f);

    operation.subscribe({
      next: () => {
        this.isCreating.set(false);
        this.showModal.set(false);
        this.successMessage.set(this.isEditMode() ? 'Point relais modifié avec succès.' : 'Point relais créé avec succès.');
        this.chargerRelais();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: () => {
        this.isCreating.set(false);
        this.erreurMessage.set('Erreur lors de la sauvegarde.');
      }
    });
  }

  tauxOccupation(r: RelaisAdmin): number {
    if (!r.capaciteMaxColis) return 0;
    return Math.round((r.stockActuel / r.capaciteMaxColis) * 100);
  }
}