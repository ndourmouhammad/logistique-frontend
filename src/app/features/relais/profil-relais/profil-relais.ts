import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RelaisLayout } from '../../../shared/components/relais-layout/relais-layout';
import { Auth } from '../../../core/services/auth';
import { RelaisContext } from '../../../core/services/relais-context';

@Component({
  selector: 'app-profil-relais',
  imports: [CommonModule, RouterModule, RelaisLayout],
  templateUrl: './profil-relais.html',
  styleUrl: './profil-relais.scss',
})
export class ProfilRelais implements OnInit {

  nomComplet   = signal('');
  initiales    = signal('');
  nomEnseigne  = signal('');
  villeRelais  = signal('');
  showConfirm  = signal(false);

  private authService   = inject(Auth);
  private relaisContext = inject(RelaisContext);

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

    // Charger les infos du point relais
    this.relaisContext.chargerRelais();
  }

  // Computed depuis RelaisContext
  get nomRelais(): string  { return this.relaisContext.nomEnseigne; }
  get ville(): string      { return this.relaisContext.villeRelais;  }

  demanderConfirmation() { this.showConfirm.set(true);  }
  annulerDeconnexion()   { this.showConfirm.set(false); }
  confirmerDeconnexion() { this.authService.logout();   }
}