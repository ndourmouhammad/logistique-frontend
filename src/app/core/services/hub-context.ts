import { Injectable, inject, signal } from '@angular/core';
import { HubService } from './hub';
import { Auth } from './auth';
import { HubResponse } from '../models/hub.model';

@Injectable({ providedIn: 'root' })
export class HubContext {

  hub = signal<HubResponse | null>(null);
  isLoaded = signal(false);

  private hubService = inject(HubService);
  private authService = inject(Auth);

  chargerHub() {
    if (this.isLoaded()) return;

    const gestionnaireId = this.authService.getUserId();
    if (!gestionnaireId) return;

    this.hubService.getMonHub(gestionnaireId).subscribe({
      next: (hub) => {
        this.hub.set(hub);
        this.isLoaded.set(true);
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