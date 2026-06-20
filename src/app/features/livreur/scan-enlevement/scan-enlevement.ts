import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth';
import { ExpeditionListItem } from '../../../core/models/relais.model';
import { LivreurService } from '../../../core/services/livreur';

@Component({
  selector: 'app-scan-enlevement',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './scan-enlevement.html',
  styleUrl: './scan-enlevement.scss',
})
export class ScanEnlevement implements OnInit {

  codeSaisi         = signal('');
  expeditionsDispos = signal<ExpeditionListItem[]>([]);
  colisTrouve       = signal<ExpeditionListItem | null>(null);
  isLoading         = signal(false);
  isCollecting      = signal(false);
  erreurMessage     = signal('');
  successMessage    = signal('');

  private livreurService = inject(LivreurService);
  private authService    = inject(Auth);
  private router         = inject(Router);

  ngOnInit() {
    this.chargerExpeditionsDispos();
  }

  chargerExpeditionsDispos() {
    const livreurId = this.authService.getUserId();
    if (!livreurId) return;

    this.isLoading.set(true);
    this.livreurService.getExpeditionsACollecter(livreurId).subscribe({
      next: (data) => {
        this.isLoading.set(false);
        this.expeditionsDispos.set(data);
      },
      error: () => {
        this.isLoading.set(false);
        this.erreurMessage.set('Erreur lors du chargement.');
      }
    });
  }

  onCodeChange(value: string) {
    this.codeSaisi.set(value);
    this.colisTrouve.set(null);
    this.erreurMessage.set('');
  }

  rechercherParCode() {
    const code = this.codeSaisi().trim().toUpperCase();
    const found = this.expeditionsDispos().find(e => e.codeTracking === code);
    if (found) {
      this.colisTrouve.set(found);
      this.erreurMessage.set('');
    } else {
      this.colisTrouve.set(null);
      this.erreurMessage.set('Aucune expédition trouvée avec ce code.');
    }
  }

  collecterColis() {
    const colis = this.colisTrouve();
    const livreurId = this.authService.getUserId();
    if (!colis || !livreurId) return;

    this.isCollecting.set(true);
    this.erreurMessage.set('');

    this.livreurService.collecterExpedition(colis.id, livreurId).subscribe({
      next: () => {
        this.isCollecting.set(false);
        this.successMessage.set(`Colis ${colis.codeTracking} collecté avec succès !`);
        this.colisTrouve.set(null);
        this.codeSaisi.set('');
        this.chargerExpeditionsDispos();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: () => {
        this.isCollecting.set(false);
        this.erreurMessage.set('Erreur lors de la collecte.');
      }
    });
  }
}