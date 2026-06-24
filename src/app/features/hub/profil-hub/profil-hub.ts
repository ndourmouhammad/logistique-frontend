import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HubLayout } from '../../../shared/components/hub-layout/hub-layout';
import { Auth } from '../../../core/services/auth';
import { HubContext } from '../../../core/services/hub-context';

@Component({
  selector: 'app-profil-hub',
  imports: [CommonModule, RouterModule, HubLayout],
  templateUrl: './profil-hub.html',
  styleUrl: './profil-hub.scss',
})
export class ProfilHub implements OnInit {

  nomComplet  = signal('');
  initiales   = signal('');
  showConfirm = signal(false);

  private authService = inject(Auth);
  private hubContext  = inject(HubContext);

  ngOnInit() {
    const nom = this.authService.getNomComplet() || '';
    this.nomComplet.set(nom);
    this.initiales.set(
      nom.split(' ')
        .map(n => n.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase()
    );
    this.hubContext.chargerHub();
  }

  get nomHub():   string { return this.hubContext.hub()?.nom   ?? '—'; }
  get villeHub(): string { return this.hubContext.hub()?.ville ?? '—'; }

  demanderConfirmation() { this.showConfirm.set(true);  }
  annulerDeconnexion()   { this.showConfirm.set(false); }
  confirmerDeconnexion() { this.authService.logout();   }
}