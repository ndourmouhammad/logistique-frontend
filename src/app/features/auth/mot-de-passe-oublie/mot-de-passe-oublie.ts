import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-mot-de-passe-oublie',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './mot-de-passe-oublie.html',
  styleUrl: './mot-de-passe-oublie.scss',
})
export class MotDePasseOublie {

  email         = signal('');
  isLoading     = signal(false);
  erreurMessage = signal('');
  etape         = signal(1); // 1: saisie email, 2: confirmation envoi

  private authService = inject(Auth);

  envoyerLien() {
    if (!this.email().trim()) {
      this.erreurMessage.set('Veuillez saisir votre adresse email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email())) {
      this.erreurMessage.set("L'adresse email n'est pas valide.");
      return;
    }

    this.isLoading.set(true);
    this.erreurMessage.set('');

    this.authService.demanderReinitialisationMotDePasse(this.email()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.etape.set(2);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.erreurMessage.set(
          err.error?.includes('Aucun compte')
            ? 'Aucun compte trouvé avec cet email.'
            : 'Erreur serveur. Réessayez.'
        );
      }
    });
  }
}