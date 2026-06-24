import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-changer-mot-de-passe',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './changer-mot-de-passe.html',
  styleUrl: './changer-mot-de-passe.scss',
})
export class ChangerMotDePasse implements OnInit {

  // Mode : 'profil' (changement volontaire) ou 'premier' (forcé premier connexion)
  mode              = signal<'profil' | 'premier'>('profil');

  ancienMotDePasse  = signal('');
  nouveauMotDePasse = signal('');
  confirmation      = signal('');
  showPassword      = signal(false);
  isLoading         = signal(false);
  erreurMessage     = signal('');
  succes            = signal(false);

  private authService = inject(Auth);
  protected router      = inject(Router);

  ngOnInit() {
    // Détecter si on vient d'un premier connexion forcé
    if (this.authService.isPremierConnexion()) {
      this.mode.set('premier');
    }
  }

  togglePassword() { this.showPassword.update(v => !v); }

  valider() {
    this.erreurMessage.set('');

    // Validations communes
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

    const userId = this.authService.getUserId();
    if (!userId) { this.router.navigate(['/connexion']); return; }

    this.isLoading.set(true);

    if (this.mode() === 'premier') {
      // Changement forcé — pas besoin de l'ancien mot de passe
      this.authService.changerMotDePassePremierConnexion(userId, this.nouveauMotDePasse())
        .subscribe({
          next: () => this.onSucces(),
          error: (err) => this.onErreur(err)
        });
    } else {
      // Changement volontaire — ancien mot de passe requis
      if (!this.ancienMotDePasse()) {
        this.isLoading.set(false);
        this.erreurMessage.set("L'ancien mot de passe est requis.");
        return;
      }
      this.authService.changerMotDePasse(userId, this.ancienMotDePasse(), this.nouveauMotDePasse())
        .subscribe({
          next: () => this.onSucces(),
          error: (err) => this.onErreur(err)
        });
    }
  }

  private onSucces() {
    this.isLoading.set(false);
    // Mettre à jour le flag en local
    localStorage.setItem('premierConnexion', 'false');
    this.succes.set(true);
  }

  private onErreur(err: any) {
    this.isLoading.set(false);
    this.erreurMessage.set(
      err.error?.includes('incorrect') ? 'Ancien mot de passe incorrect.' :
      'Erreur serveur. Réessayez.'
    );
  }

  continuer() {
    this.authService.redirectByRole();
  }
}