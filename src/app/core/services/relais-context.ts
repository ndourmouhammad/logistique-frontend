import { Injectable, inject, signal } from '@angular/core';
import { RelaisService } from './relais';
import { Auth } from './auth';
import { PointRelaisContext } from '../models/relais.model';

@Injectable({ providedIn: 'root' })
export class RelaisContext {

  pointRelais = signal<PointRelaisContext | null>(null);
  isLoaded    = signal(false);

  private relaisService = inject(RelaisService);
  private authService    = inject(Auth);

  chargerRelais() {
    if (this.isLoaded()) return;

    const gerantId = this.authService.getUserId();
    if (!gerantId) return;

    this.relaisService.getMonRelais(gerantId).subscribe({
      next: (pr) => {
        this.pointRelais.set(pr);
        this.isLoaded.set(true);
      },
      error: () => {
        console.error('Impossible de charger le point relais du gérant');
      }
    });
  }

  get relaisId(): number {
    return this.pointRelais()?.id ?? 5;
  }

  get villeRelais(): string {
    return this.pointRelais()?.ville ?? 'Dakar';
  }

  get nomEnseigne(): string {
    return this.pointRelais()?.nomEnseigne ?? '';
  }
}