import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HubLayout } from '../../../shared/components/hub-layout/hub-layout';
import { ExpeditionListItem, HubService } from '../../../core/services/hub';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-reception-colis',
  imports: [HubLayout, FormsModule, CommonModule, RouterModule],
  templateUrl: './reception-colis.html',
  styleUrl: './reception-colis.scss',
})
export class ReceptionColis implements OnInit {
  recherche = signal('');
  codeSaisi = signal('');
  colisEnAttente = signal<ExpeditionListItem[]>([]);
  isLoading = signal(false);
  erreurMessage = signal('');
  successMessage = signal('');

  hubId = 1;

  private hubService = inject(HubService);

  ngOnInit() {
    this.chargerColisAttendus();
  }

  chargerColisAttendus() {
    this.isLoading.set(true);
    this.hubService.getColisAttendus(this.hubId).subscribe({
      next: (data) => {
        this.isLoading.set(false);
        this.colisEnAttente.set(data);
      },
      error: () => {
        this.isLoading.set(false);
        this.erreurMessage.set('Erreur lors du chargement des colis.');
      },
    });
  }

  colisFiltres(): ExpeditionListItem[] {
    const recherche = this.recherche().toLowerCase();
    return this.colisEnAttente().filter(
      (c) =>
        c.codeTracking.toLowerCase().includes(recherche) ||
        c.villeDestinataire?.toLowerCase().includes(recherche),
    );
  }

  onRechercheChange(value: string) {
    this.recherche.set(value);
  }

  onCodeSaisiChange(value: string) {
    this.codeSaisi.set(value);
  }

  receptionnerParCode() {
    const code = this.codeSaisi().trim().toUpperCase();
    const colis = this.colisEnAttente().find((c) => c.codeTracking === code);

    if (!colis) {
      this.erreurMessage.set('Aucun colis attendu trouvé avec ce code.');
      setTimeout(() => this.erreurMessage.set(''), 3000);
      return;
    }
    this.receptionner(colis.id);
  }

  receptionner(expeditionId: number) {
    this.erreurMessage.set('');
    this.successMessage.set('');

    this.hubService.recevoirColis(expeditionId, this.hubId).subscribe({
      next: (expedition) => {
        this.successMessage.set(`Colis ${expedition.codeTracking} réceptionné avec succès.`);
        this.codeSaisi.set('');
        this.chargerColisAttendus();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: () => {
        this.erreurMessage.set('Erreur lors de la réception du colis.');
        setTimeout(() => this.erreurMessage.set(''), 3000);
      },
    });
  }
}
