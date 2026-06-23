import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LivreurLayout } from '../../../shared/components/livreur-layout/livreur-layout';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-profil-livreur',
  imports: [CommonModule, RouterModule, LivreurLayout],
  templateUrl: './profil-livreur.html',
  styleUrl: './profil-livreur.scss',
})
export class ProfilLivreur implements OnInit {

  nomComplet    = signal('');
  initiales     = signal('');
  email         = signal('');
  showConfirm   = signal(false);

  private authService = inject(Auth);
  private router      = inject(Router);

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

  demanderConfirmation() {
    this.showConfirm.set(true);
  }

  annulerDeconnexion() {
    this.showConfirm.set(false);
  }

  confirmerDeconnexion() {
    this.authService.logout();
  }
}