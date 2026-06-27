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
    this.form.set({ nom: '', capaciteStockage: 100, rue: '', ville: '', region: '' });
    this.erreurMessage.set('');
    this.showModal.set(true);
  }

  fermerModal() { this.showModal.set(false); }

  updateForm(field: string, value: any) {
    this.form.update(f => ({ ...f, [field]: value }));
  }

  creerHub() {
    const f = this.form();
    if (!f.nom || !f.ville) {
      this.erreurMessage.set('Le nom et la ville sont requis.');
      return;
    }

    this.isCreating.set(true);
    this.erreurMessage.set('');

    this.adminService.creerHub(f).subscribe({
      next: () => {
        this.isCreating.set(false);
        this.showModal.set(false);
        this.successMessage.set('Hub créé avec succès.');
        this.chargerHubs();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: () => {
        this.isCreating.set(false);
        this.erreurMessage.set('Erreur lors de la création.');
      }
    });
  }
}