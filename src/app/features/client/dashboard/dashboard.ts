import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { Auth } from '../../../core/services/auth';
import { ExpeditionService } from '../../../core/services/expedition';
import { ExpeditionResponse } from '../../../core/models/expedition.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, ClientLayout],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  nomUtilisateur = '';
  dateAujourdhui = new Date();

  expeditions: ExpeditionResponse[] = [];
  isLoading = true;

  // KPIs
  totalMois = 0;
  enCours = 0;
  livrees = 0;
  depensesMois = 0;

  activeExpedition: ExpeditionResponse | null = null;
  erreurDashboard = '';

  // Pagination
  pageCourante = 1;
  itemsParPage = 4;

  get expeditionsPaginees(): ExpeditionResponse[] {
    const start = (this.pageCourante - 1) * this.itemsParPage;
    return this.expeditions.slice(start, start + this.itemsParPage);
  }

  get totalPages(): number {
    return Math.ceil(this.expeditions.length / this.itemsParPage);
  }

  get finPageCourante(): number {
    return Math.min(this.pageCourante * this.itemsParPage, this.expeditions.length);
  }

  pagePrecedente() {
    if (this.pageCourante > 1) {
      this.pageCourante--;
    }
  }

  pageSuivante() {
    if (this.pageCourante < this.totalPages) {
      this.pageCourante++;
    }
  }

  private auth = inject(Auth);
  private expeditionService = inject(ExpeditionService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.nomUtilisateur = this.auth.getNomComplet()?.split(' ')[0] || 'Client';
    const userId = this.auth.getUserId();
    if (userId) {
      this.chargerDonnees(userId);
    } else {
      this.erreurDashboard = "ID utilisateur introuvable. Veuillez vous reconnecter.";
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  chargerDonnees(userId: number) {
    this.expeditionService.getHistoriqueClient(userId).subscribe({
      next: (data) => {
        this.expeditions = data.sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());
        this.calculerKPIs();
        this.activeExpedition = this.expeditions.find(e => e.statut !== 'LIVRE' && e.statut !== 'RETOURNE' && e.statut !== 'EN_LITIGE') || null;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement dashboard', err);
        this.erreurDashboard = "Impossible de joindre le serveur ou erreur API.";
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculerKPIs() {
    this.totalMois = 0;
    this.enCours = 0;
    this.livrees = 0;
    this.depensesMois = 0;

    const now = new Date();
    const moisCourant = now.getMonth();
    const anneeCourante = now.getFullYear();

    this.expeditions.forEach(exp => {
      const dateExp = new Date(exp.dateCreation);
      const isCeMois = dateExp.getMonth() === moisCourant && dateExp.getFullYear() === anneeCourante;

      if (isCeMois) {
        this.totalMois++;
        this.depensesMois += exp.fraisLivraison || 0;
      }

      if (exp.statut === 'LIVRE') {
        this.livrees++;
      } else if (exp.statut !== 'RETOURNE' && exp.statut !== 'EN_LITIGE') {
        this.enCours++;
      }
    });
  }

  getStatutClass(statut: string): string {
    const classes: Record<string, string> = {
      'CREE':               'bg-purple-50 text-purple-700',
      'EN_COURS_RAMASSAGE': 'bg-blue-50 text-blue-700',
      'RECU_AU_HUB':        'bg-indigo-50 text-indigo-700',
      'EN_TRANSIT':         'bg-orange-50 text-orange-700',
      'EN_COURS_LIVRAISON': 'bg-yellow-50 text-yellow-700',
      'LIVRE':              'bg-emerald-50 text-emerald-700',
      'RETOURNE':           'bg-red-50 text-red-700',
      'EN_LITIGE':          'bg-red-100 text-red-800',
    };
    return classes[statut] || 'bg-slate-50 text-slate-500';
  }

  getStatutIcon(statut: string): string {
    const icons: Record<string, string> = {
      'CREE':               'ti-file-invoice',
      'EN_COURS_RAMASSAGE': 'ti-truck-loading',
      'RECU_AU_HUB':        'ti-building-warehouse',
      'EN_TRANSIT':         'ti-truck',
      'EN_COURS_LIVRAISON': 'ti-truck-delivery',
      'LIVRE':              'ti-check',
      'RETOURNE':           'ti-arrow-back-up',
      'EN_LITIGE':          'ti-alert-circle',
    };
    return icons[statut] || 'ti-circle';
  }

  getStatutLabel(statut: string): string {
    const labels: Record<string, string> = {
      'CREE':               'Créée',
      'EN_COURS_RAMASSAGE': 'Ramassage',
      'RECU_AU_HUB':        'Au hub',
      'EN_TRANSIT':         'En transit',
      'EN_COURS_LIVRAISON': 'En livraison',
      'LIVRE':              'Livrée',
      'RETOURNE':           'Retournée',
      'EN_LITIGE':          'En litige',
    };
    return labels[statut] || statut;
  }
}
