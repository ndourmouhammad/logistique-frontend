import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-reinitialiser-mot-de-passe',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './reinitialiser-mot-de-passe.html',
  styleUrl: './reinitialiser-mot-de-passe.scss',
})
export class ReinitialiserMotDePasse implements OnInit {

  token           = signal('');
  nouveauMotDePasse = signal('');
  confirmation    = signal('');
  showPassword    = signal(false);
  isLoading       = signal(false);
  erreurMessage   = signal('');
  etape           = signal(1); // 1: formulaire, 2: succès
  tokenInvalide   = signal(false);

  private authService = inject(Auth);
  private route       = inject(ActivatedRoute);
  private router      = inject(Router);

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.tokenInvalide.set(true);
      return;
    }
    this.token.set(token);
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  reinitialiser() {
    this.erreurMessage.set('');

    if (this.nouveauMotDePasse().length < 8) {
      this.erreurMessage.set('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (!/[A-Z]/.test(this.nouveauMotDePasse())) {
      this.erreurMessage.set('Le mot de passe doit contenir au moins 1 majuscule.');
      return;
    }
    if (!/[0-9]/.test(this.nouveauMotDePasse())) {
      this.erreurMessage.set('Le mot de passe doit contenir au moins 1 chiffre.');
      return;
    }
    if (this.nouveauMotDePasse() !== this.confirmation()) {
      this.erreurMessage.set('Les mots de passe ne correspondent pas.');
      return;
    }

    this.isLoading.set(true);

    this.authService.reinitialiserMotDePasse(
      this.token(),
      this.nouveauMotDePasse()
    ).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.etape.set(2);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.erreurMessage.set(
          err.error?.includes('expiré') ? 'Ce lien a expiré. Refaites la demande.' :
          err.error?.includes('utilisé') ? 'Ce lien a déjà été utilisé.' :
          'Lien invalide. Refaites la demande.'
        );
      }
    });
  }
}