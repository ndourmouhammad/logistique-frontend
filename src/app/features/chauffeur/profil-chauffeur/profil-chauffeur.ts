import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChauffeurLayout } from '../../../shared/components/chauffeur-layout/chauffeur-layout';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-profil-chauffeur',
  imports: [CommonModule, RouterModule, ChauffeurLayout],
  templateUrl: './profil-chauffeur.html',
  styleUrl: './profil-chauffeur.scss',
})
export class ProfilChauffeur implements OnInit {

  nomComplet  = signal('');
  initiales   = signal('');
  showConfirm = signal(false);

  private authService = inject(Auth);

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
  }

  demanderConfirmation()  { this.showConfirm.set(true);  }
  annulerDeconnexion()    { this.showConfirm.set(false); }
  confirmerDeconnexion()  { this.authService.logout();   }
}