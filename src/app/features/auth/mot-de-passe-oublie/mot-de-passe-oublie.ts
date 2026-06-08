import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-mot-de-passe-oublie',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './mot-de-passe-oublie.html',
  styleUrl: './mot-de-passe-oublie.scss',
})
export class MotDePasseOublie {
  email       = '';
  telephone   = ''; // Pour simuler la saisie d'un numéro pour le SMS si nécessaire, ou on utilise email dans les deux cas. On va ajouter telephone si méthode === sms
  otpCode     = '';
  newPassword = '';
  confirmPassword = '';
  etape       = 1; // 1: méthode, 2: email/sms, 3: OTP, 4: nouveau mdp, 5: succès
  isLoading   = false;
  methode     = 'sms'; // 'sms' | 'email'
  
  showPassword = false;

  // Erreurs
  errors: { [key: string]: string } = {};
  submitted = false;

  constructor(private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // ── Étape 1 & 2 : Saisie coordonnée ─────────────────────────
  validateContact(): boolean {
    this.errors = {};
    if (this.methode === 'email') {
      if (!this.email.trim()) {
        this.errors['email'] = "L'adresse email est requise.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
        this.errors['email'] = "L'adresse email n'est pas valide.";
      }
    } else {
      if (!this.telephone.trim()) {
        this.errors['telephone'] = 'Le numéro de téléphone est requis.';
      } else if (!/^\d{9}$/.test(this.telephone.replace(/\s/g, ''))) {
        this.errors['telephone'] = 'Le numéro doit contenir 9 chiffres.';
      }
    }
    return Object.keys(this.errors).length === 0;
  }

  allerSaisieContact() {
    this.etape = 2; // on va à l'écran pour taper le tel ou l'email
  }

  envoyerOTP() {
    this.submitted = true;
    if (this.validateContact()) {
      this.submitted = false;
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.etape = 3;
      }, 1500);
    }
  }

  // ── Étape 3 : OTP ───────────────────────────────────────────
  otpValues = ['', '', '', ''];

  verifierOTP() {
    this.errors = {};
    const code = this.otpValues.join('');
    if (code.length < 4) {
      this.errors['otp'] = 'Veuillez saisir le code complet.';
      return;
    }

    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.etape = 4;
    }, 1500);
  }

  // ── Étape 4 : Nouveau mot de passe ──────────────────────────
  validatePassword(): boolean {
    this.errors = {};
    
    if (!this.newPassword) {
      this.errors['newPassword'] = 'Le mot de passe est requis.';
    } else if (this.newPassword.length < 8) {
      this.errors['newPassword'] = 'Le mot de passe doit contenir au moins 8 caractères.';
    } else if (!/[A-Z]/.test(this.newPassword)) {
      this.errors['newPassword'] = 'Le mot de passe doit contenir au moins 1 majuscule.';
    } else if (!/[0-9]/.test(this.newPassword)) {
      this.errors['newPassword'] = 'Le mot de passe doit contenir au moins 1 chiffre.';
    }

    if (!this.confirmPassword) {
      this.errors['confirmPassword'] = 'La confirmation du mot de passe est requise.';
    } else if (this.newPassword !== this.confirmPassword) {
      this.errors['confirmPassword'] = 'Les mots de passe ne correspondent pas.';
    }

    return Object.keys(this.errors).length === 0;
  }

  reinitialiser() {
    this.submitted = true;
    if (this.validatePassword()) {
      this.submitted = false;
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.etape = 5;
      }, 1500);
    }
  }

  clearError(field: string) {
    if (this.errors[field]) {
      delete this.errors[field];
    }
  }
}
