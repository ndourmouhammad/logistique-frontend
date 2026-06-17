import { Component, signal } from '@angular/core';
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
  email       = signal('');
  telephone   = signal(''); 
  otpCode     = signal('');
  newPassword = signal('');
  confirmPassword = signal('');
  etape       = signal(1); // 1: méthode, 2: email/sms, 3: OTP, 4: nouveau mdp, 5: succès
  isLoading   = signal(false);
  methode     = signal('sms'); // 'sms' | 'email'
  
  showPassword = signal(false);

  // Erreurs
  errors = signal<{ [key: string]: string }>({});
  submitted = signal(false);

  constructor(private router: Router) {}

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  // ── Étape 1 & 2 : Saisie coordonnée ─────────────────────────
  validateContact(): boolean {
    const errs: { [key: string]: string } = {};
    if (this.methode() === 'email') {
      if (!this.email().trim()) {
        errs['email'] = "L'adresse email est requise.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email())) {
        errs['email'] = "L'adresse email n'est pas valide.";
      }
    } else {
      if (!this.telephone().trim()) {
        errs['telephone'] = 'Le numéro de téléphone est requis.';
      } else if (!/^\d{9}$/.test(this.telephone().replace(/\s/g, ''))) {
        errs['telephone'] = 'Le numéro doit contenir 9 chiffres.';
      }
    }
    this.errors.set(errs);
    return Object.keys(errs).length === 0;
  }

  allerSaisieContact() {
    this.etape.set(2);
  }

  envoyerOTP() {
    this.submitted.set(true);
    if (this.validateContact()) {
      this.submitted.set(false);
      this.isLoading.set(true);
      setTimeout(() => {
        this.isLoading.set(false);
        this.etape.set(3);
      }, 1500);
    }
  }

  // ── Étape 3 : OTP ───────────────────────────────────────────
  otpValues = signal(['', '', '', '']);

  verifierOTP() {
    this.errors.set({});
    const code = this.otpValues().join('');
    if (code.length < 4) {
      this.errors.update(errs => ({ ...errs, otp: 'Veuillez saisir le code complet.' }));
      return;
    }

    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.etape.set(4);
    }, 1500);
  }

  // ── Étape 4 : Nouveau mot de passe ──────────────────────────
  validatePassword(): boolean {
    const errs: { [key: string]: string } = {};
    
    if (!this.newPassword()) {
      errs['newPassword'] = 'Le mot de passe est requis.';
    } else if (this.newPassword().length < 8) {
      errs['newPassword'] = 'Le mot de passe doit contenir au moins 8 caractères.';
    } else if (!/[A-Z]/.test(this.newPassword())) {
      errs['newPassword'] = 'Le mot de passe doit contenir au moins 1 majuscule.';
    } else if (!/[0-9]/.test(this.newPassword())) {
      errs['newPassword'] = 'Le mot de passe doit contenir au moins 1 chiffre.';
    }

    if (!this.confirmPassword()) {
      errs['confirmPassword'] = 'La confirmation du mot de passe est requise.';
    } else if (this.newPassword() !== this.confirmPassword()) {
      errs['confirmPassword'] = 'Les mots de passe ne correspondent pas.';
    }

    this.errors.set(errs);
    return Object.keys(errs).length === 0;
  }

  reinitialiser() {
    this.submitted.set(true);
    if (this.validatePassword()) {
      this.submitted.set(false);
      this.isLoading.set(true);
      setTimeout(() => {
        this.isLoading.set(false);
        this.etape.set(5);
      }, 1500);
    }
  }

  clearError(field: string) {
    if (this.errors()[field]) {
      const errs = { ...this.errors() };
      delete errs[field];
      this.errors.set(errs);
    }
  }

  updateOtpValue(index: number, value: string) {
    const values = [...this.otpValues()];
    values[index] = value;
    this.otpValues.set(values);
  }
}
