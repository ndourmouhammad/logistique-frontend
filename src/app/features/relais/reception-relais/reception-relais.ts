import { Component, inject, signal, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RelaisLayout } from '../../../shared/components/relais-layout/relais-layout';
import { ExpeditionListItem } from '../../../core/models/relais.model';
import { RelaisService } from '../../../core/services/relais';
import { RelaisContext } from '../../../core/services/relais-context';

@Component({
  selector: 'app-reception-relais',
  imports: [CommonModule, RouterModule, FormsModule, RelaisLayout],
  templateUrl: './reception-relais.html',
  styleUrl: './reception-relais.scss',
})
export class ReceptionRelais implements OnInit {
  codeSaisi      = signal('');
  colisAttendus  = signal<ExpeditionListItem[]>([]);
  isLoading      = signal(false);
  erreurMessage  = signal('');
  successMessage = signal('');

  private relaisService = inject(RelaisService);
  private relaisContext = inject(RelaisContext);

  constructor() {
    effect(() => {
      if (this.relaisContext.isLoaded()) {
        this.chargerColisAttendus();
      }
    });
  }

  ngOnInit() {
    this.relaisContext.chargerRelais();
  }

  chargerColisAttendus() {
    this.isLoading.set(true);
    this.relaisService.getColisAttendus(this.relaisContext.relaisId).subscribe({
      next: (data) => {
        this.isLoading.set(false);
        this.colisAttendus.set(data);
      },
      error: () => {
        this.isLoading.set(false);
        this.erreurMessage.set('Erreur lors du chargement des colis.');
      }
    });
  }

  onCodeSaisiChange(value: string) {
    this.codeSaisi.set(value);
  }

  receptionnerParCode() {
    const code = this.codeSaisi().trim().toUpperCase();
    const colis = this.colisAttendus().find(c => c.codeTracking === code);

    if (!colis) {
      this.erreurMessage.set('Aucun colis attendu trouvé avec ce code.');
      setTimeout(() => this.erreurMessage.set(''), 3000);
      return;
    }
    this.deposer(colis.id);
  }

  deposer(expeditionId: number) {
    this.erreurMessage.set('');
    this.successMessage.set('');

    this.relaisService.deposerColis(expeditionId, this.relaisContext.relaisId).subscribe({
      next: (expedition) => {
        this.successMessage.set(`Colis ${expedition.codeTracking} déposé avec succès.`);
        this.codeSaisi.set('');
        this.chargerColisAttendus();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: () => {
        this.erreurMessage.set('Erreur lors du dépôt du colis.');
        setTimeout(() => this.erreurMessage.set(''), 3000);
      }
    });
  }
}