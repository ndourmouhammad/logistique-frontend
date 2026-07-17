import { Component, inject, OnInit, signal, computed, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  nomUtilisateur = signal('');
  dateAujourdhui = new Date();

  expeditions = signal<ExpeditionResponse[]>([]);
  isLoading = signal(true);

  // KPIs
  totalMois      = signal(0);
  enCours        = signal(0);
  livrees        = signal(0);
  depensesMois   = signal(0);

  activeExpedition = signal<ExpeditionResponse | null>(null);
  erreurDashboard  = signal('');

  // Pagination
  pageCourante  = signal(1);
  itemsParPage  = 4;

  expeditionsPaginees = computed<ExpeditionResponse[]>(() => {
    const start = (this.pageCourante() - 1) * this.itemsParPage;
    return this.expeditions().slice(start, start + this.itemsParPage);
  });

  totalPages = computed<number>(() =>
    Math.ceil(this.expeditions().length / this.itemsParPage)
  );

  finPageCourante = computed<number>(() =>
    Math.min(this.pageCourante() * this.itemsParPage, this.expeditions().length)
  );

  pagePrecedente() {
    if (this.pageCourante() > 1) {
      this.pageCourante.update(p => p - 1);
    }
  }

  pageSuivante() {
    if (this.pageCourante() < this.totalPages()) {
      this.pageCourante.update(p => p + 1);
    }
  }

  private auth = inject(Auth);
  private expeditionService = inject(ExpeditionService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.nomUtilisateur.set(this.auth.getNomComplet()?.split(' ')[0] || 'Client');
    const userId = this.auth.getUserId();
    if (userId) {
      this.chargerDonnees(userId);
    } else {
      this.erreurDashboard.set("ID utilisateur introuvable. Veuillez vous reconnecter.");
      this.isLoading.set(false);
    }
  }

  chargerDonnees(userId: number) {
    this.expeditionService.getHistoriqueClient(userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: (data) => {
        this.expeditions.set(data.sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()));
        this.calculerKPIs();
        this.activeExpedition.set(
          this.expeditions().find(e => e.statut !== 'LIVRE' && e.statut !== 'RETOURNE' && e.statut !== 'EN_LITIGE') || null
        );
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement dashboard', err);
        this.erreurDashboard.set("Impossible de joindre le serveur ou erreur API.");
        this.isLoading.set(false);
      }
    });
  }

  calculerKPIs() {
    let totalMois = 0;
    let enCours = 0;
    let livrees = 0;
    let depensesMois = 0;

    const now = new Date();
    const moisCourant = now.getMonth();
    const anneeCourante = now.getFullYear();

    this.expeditions().forEach(exp => {
      const dateExp = new Date(exp.dateCreation);
      const isCeMois = dateExp.getMonth() === moisCourant && dateExp.getFullYear() === anneeCourante;

      if (isCeMois) {
        totalMois++;
        depensesMois += exp.fraisLivraison || 0;
      }

      if (exp.statut === 'LIVRE') {
        livrees++;
      } else if (exp.statut !== 'RETOURNE' && exp.statut !== 'EN_LITIGE') {
        enCours++;
      }
    });

    this.totalMois.set(totalMois);
    this.enCours.set(enCours);
    this.livrees.set(livrees);
    this.depensesMois.set(depensesMois);
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
