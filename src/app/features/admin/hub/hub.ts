import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminLayout } from '../../../shared/components/admin-layout/admin-layout';
import { AdminService } from '../../../core/services/admin';
import { HubAdmin, HubRequest } from '../../../core/models/admin.model';

@Component({
  selector: 'app-hub',
  imports: [CommonModule, RouterModule, FormsModule, AdminLayout],
  templateUrl: './hub.html',
  styleUrl: './hub.scss',
})
export class Hub implements OnInit {

  hubs          = signal<HubAdmin[]>([]);
  isLoading     = signal(false);
  showModal     = signal(false);
  isCreating    = signal(false);
  erreurMessage = signal('');
  successMessage = signal('');
  recherche     = signal('');

  editingHubId  = signal<number | null>(null);
  isEditMode    = signal(false);

  form = signal<HubRequest>({
    nom: '', capaciteStockage: 100,
    rue: '', ville: '', region: ''
  });

  hubsFiltres = computed(() => {
    const r = this.recherche().toLowerCase();
    return this.hubs().filter(h =>
      h.nom.toLowerCase().includes(r) ||
      h.ville.toLowerCase().includes(r)
    );
  });

  private adminService = inject(AdminService);

  ngOnInit() { this.chargerHubs(); }

  chargerHubs() {
    this.isLoading.set(true);
    this.adminService.getHubs().subscribe({
      next: (data) => { this.isLoading.set(false); this.hubs.set(data); },
      error: () => this.isLoading.set(false)
    });
  }

  ouvrirModal() {
    this.isEditMode.set(false);
    this.editingHubId.set(null);
    this.form.set({ nom: '', capaciteStockage: 100, rue: '', ville: '', region: '' });
    this.erreurMessage.set('');
    this.showModal.set(true);
  }

  ouvrirModalEdition(hub: HubAdmin) {
    this.isEditMode.set(true);
    this.editingHubId.set(hub.id);
    this.form.set({
      nom: hub.nom,
      capaciteStockage: hub.capaciteStockage || 100,
      rue: hub.rue || '',
      ville: hub.ville || '',
      region: hub.region || ''
    });
    this.erreurMessage.set('');
    this.showModal.set(true);
  }

  fermerModal() { this.showModal.set(false); }

  updateForm(field: string, value: any) {
    this.form.update(f => ({ ...f, [field]: value }));
  }

  sauvegarderHub() {
    const f = this.form();
    if (!f.nom || !f.ville) {
      this.erreurMessage.set('Le nom et la ville sont requis.');
      return;
    }

    this.isCreating.set(true);
    this.erreurMessage.set('');

    const operation = this.isEditMode() && this.editingHubId()
      ? this.adminService.modifierHub(this.editingHubId()!, f)
      : this.adminService.creerHub(f);

    operation.subscribe({
      next: () => {
        this.isCreating.set(false);
        this.showModal.set(false);
        this.successMessage.set(this.isEditMode() ? 'Hub modifié avec succès.' : 'Hub créé avec succès.');
        this.chargerHubs();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: () => {
        this.isCreating.set(false);
        this.erreurMessage.set('Erreur lors de la sauvegarde.');
      }
    });
  }
}