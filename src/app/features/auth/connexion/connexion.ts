import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-connexion',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './connexion.html',
  styleUrl: './connexion.scss',
})
export class Connexion {
  email          = '';
  motDePasse     = '';
  resterConnecte = false;
  showPassword   = false;
  isLoading      = false;
  erreurMessage  = '';

  private authService = inject(Auth);

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  doLogin() {
    if (!this.email || !this.motDePasse) {
      this.erreurMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    this.isLoading     = true;
    this.erreurMessage = '';

    this.authService.login({
      email:      this.email,
      motDePasse: this.motDePasse
    }).subscribe({
      next: () => {
        this.isLoading = false;
        // Redirection automatique selon le rôle
        this.authService.redirectByRole();
      },
      error: (err) => {
        this.isLoading = false;
        this.erreurMessage = err.status === 401
          ? 'Email ou mot de passe incorrect.'
          : 'Erreur serveur. Réessayez plus tard.';
      }
    });
  }
}
