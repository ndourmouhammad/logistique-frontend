import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RelaisLayout } from '../../../shared/components/relais-layout/relais-layout';
import { CommissionResponse } from '../../../core/models/relais.model';
import { RelaisService } from '../../../core/services/relais';

@Component({
  selector: 'app-commissions-relais',
  imports: [CommonModule, RouterModule, FormsModule, RelaisLayout],
  templateUrl: './commissions-relais.html',
  styleUrl: './commissions-relais.scss',
})
export class CommissionsRelais implements OnInit {

  commissions   = signal<CommissionResponse[]>([]);
  isLoading     = signal(false);
  erreurMessage = signal('');

  relaisId = 5;

  totalCommissions = computed(() =>
    this.commissions().reduce((sum, c) => sum + c.montant, 0)
  );

  totalPayees = computed(() =>
    this.commissions().filter(c => c.estPayee).reduce((sum, c) => sum + c.montant, 0)
  );

  totalEnAttente = computed(() =>
    this.commissions().filter(c => !c.estPayee).reduce((sum, c) => sum + c.montant, 0)
  );

  private relaisService = inject(RelaisService);

  ngOnInit() {
    this.chargerCommissions();
  }

  chargerCommissions() {
    this.isLoading.set(true);
    this.relaisService.getCommissions(this.relaisId).subscribe({
      next: (data) => {
        this.isLoading.set(false);
        this.commissions.set(data);
      },
      error: () => {
        this.isLoading.set(false);
        this.erreurMessage.set('Erreur lors du chargement des commissions.');
      }
    });
  }
}