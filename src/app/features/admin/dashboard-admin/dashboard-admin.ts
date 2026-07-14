import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminLayout } from '../../../shared/components/admin-layout/admin-layout';
import { AdminService } from '../../../core/services/admin';
import { AdminStats } from '../../../core/models/admin.model';

@Component({
  selector: 'app-dashboard-admin',
  imports: [CommonModule, RouterModule, AdminLayout],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.scss',
})
export class DashboardAdmin implements OnInit {

  today     = new Date();
  stats     = signal<AdminStats | null>(null);
  isLoading = signal(false);

  expeditionsRecentes: any[] = [];

  private adminService = inject(AdminService);

  ngOnInit() {
    this.chargerStats();
  }

  chargerStats() {
    this.isLoading.set(true);
    this.adminService.getStats().subscribe({
      next: (data) => {
        this.isLoading.set(false);
        this.stats.set(data);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  getStatutClass(statut: string): string {
    const map: Record<string, string> = {
      'EN_COURS_LIVRAISON': 'bg-orange-50 text-orange-700',
      'EN_TRANSIT':         'bg-blue-50 text-blue-700',
      'RECU_AU_HUB':        'bg-purple-50 text-purple-700',
      'LIVRE':              'bg-emerald-50 text-emerald-700',
      'EN_LITIGE':          'bg-red-50 text-red-700',
    };
    return map[statut] || 'bg-slate-50 text-slate-500';
  }

  getStatutLabel(statut: string): string {
    const map: Record<string, string> = {
      'EN_COURS_LIVRAISON': 'En livraison',
      'EN_TRANSIT':         'En transit',
      'RECU_AU_HUB':        'Au hub',
      'LIVRE':              'Livré',
      'EN_LITIGE':          'En litige',
    };
    return map[statut] || statut;
  }
}