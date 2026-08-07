import { Injectable, inject, signal } from '@angular/core';
import { HubService } from './hub';
import { Auth } from './auth';
import { HubResponse } from '../models/hub.model';

@Injectable({ providedIn: 'root' })
export class HubContext {

  hub = signal<HubResponse | null>(null);
  isLoaded = signal(false);
  private currentUserId = signal<number | null>(null);

  private hubService = inject(HubService);
  private authService = inject(Auth);

  chargerHub() {
    const gestionnaireId = this.authService.getUserId();
    if (!gestionnaireId) return;

    // Si on a déjà chargé le hub pour CET utilisateur, on ne refait pas la requête
    if (this.isLoaded() && this.currentUserId() === gestionnaireId) return;

    this.hubService.getMonHub(gestionnaireId).subscribe({
      next: (hub) => {
        this.hub.set(hub);
        this.isLoaded.set(true);
        this.currentUserId.set(gestionnaireId);
      },
      error: () => {
        console.error('Impossible de charger le hub du gestionnaire');
      }
    });
  }

  get hubId(): number {
    return this.hub()?.id ?? 1;
  }

  get villeHub(): string {
    return this.hub()?.ville ?? 'Dakar';
  }
}