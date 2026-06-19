import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ChauffeurLayout } from '../../../shared/components/chauffeur-layout/chauffeur-layout';
import { ChauffeurService} from '../../../core/services/chauffeur';
import { Auth } from '../../../core/services/auth';
import { ExpeditionListItem } from '../../../core/models/relais.model';

@Component({
  selector: 'app-validation-transfert',
  imports: [CommonModule, RouterModule, ChauffeurLayout],
  templateUrl: './validation-transfert.html',
  styleUrl: './validation-transfert.scss',
})
export class ValidationTransfert implements OnInit {

  expeditions    = signal<ExpeditionListItem[]>([]);
  isLoading      = signal(false);
  isConfirming   = signal(false);
  erreurMessage  = signal('');
  successMessage = signal('');

  hubDestination = signal('');
  heureArrivee   = signal(new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit'
  }));

  trajet = signal({
    depart:       'Hub Dakar · ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    arrivee:      '',
    duree:        'En cours',
    colisDeposes: 0,
    colisTotal:   0
  });

  private chauffeurService = inject(ChauffeurService);
  private authService      = inject(Auth);
  private router           = inject(Router);

  ngOnInit() {
    this.chargerExpeditionsEnTransit();
  }

  chargerExpeditionsEnTransit() {
    const chauffeurId = this.authService.getUserId();
    if (!chauffeurId) return;

    this.isLoading.set(true);
    this.chauffeurService.getMesExpeditionsEnTransit(chauffeurId).subscribe({
      next: (data) => {
        this.isLoading.set(false);
        this.expeditions.set(data);

        // Déduire le hub de destination depuis les expéditions
        if (data.length > 0) {
          const villeDestination = data[0].modeLivraison === 'RETRAIT_RELAIS' && data[0].villePointRelais
              ? data[0].villePointRelais
              : data[0].villeDestinataire;
          this.hubDestination.set('Hub ' + villeDestination);

          this.trajet.update(t => ({
            ...t,
            arrivee:      'Hub ' + villeDestination + ' · ' + this.heureArrivee(),
            colisDeposes: data.length,
            colisTotal:   data.length
          }));
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.erreurMessage.set('Erreur lors du chargement des expéditions.');
      }
    });
  }

  confirmerDechargement() {
    const chauffeurId = this.authService.getUserId();
    if (!chauffeurId) return;

    this.isConfirming.set(true);
    this.erreurMessage.set('');

    this.chauffeurService.confirmerArrivee(chauffeurId).subscribe({
      next: () => {
        this.isConfirming.set(false);
        this.successMessage.set('Arrivée confirmée — le hub va réceptionner les colis.');
        setTimeout(() => {
          this.router.navigate(['/chauffeur/historique-tournees']);
        }, 2000);
      },
      error: () => {
        this.isConfirming.set(false);
        this.erreurMessage.set('Erreur lors de la confirmation. Réessayez.');
      }
    });
  }
}