import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-inscription',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './inscription.html',
  styleUrl: './inscription.scss',
})
export class Inscription {
  nomComplet     = '';
  email          = '';
  telephone      = '';
  motDePasse     = '';
  role           = 'ROLE_CLIENT';
  showPassword   = false;
  isLoading      = false;
  accepteCGU     = false;
  etape          = 1;

  // Erreurs
  errors: { [key: string]: string } = {};
  submitted      = false;

  roles = [
    { value: 'ROLE_CLIENT',          label: 'Client',           icon: 'ti-user' },
    { value: 'ROLE_LIVREUR',         label: 'Livreur',          icon: 'ti-motorbike' },
    { value: 'ROLE_CHAUFFEUR',       label: 'Chauffeur',        icon: 'ti-truck' },
    { value: 'ROLE_GESTIONNAIRE_HUB',label: 'Gestionnaire Hub', icon: 'ti-building-warehouse' },
    { value: 'ROLE_GERANT_RELAIS',   label: 'Gérant Relais',    icon: 'ti-building-store' },
  ];

  constructor(private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // ── Validation étape 1 ──────────────────────────────────────
  validateStep1(): boolean {
    this.errors = {};

    if (!this.nomComplet.trim()) {
      this.errors['nomComplet'] = 'Le nom complet est requis.';
    } else if (this.nomComplet.trim().length < 3) {
      this.errors['nomComplet'] = 'Le nom doit contenir au moins 3 caractères.';
    }

    if (!this.telephone.trim()) {
      this.errors['telephone'] = 'Le numéro de téléphone est requis.';
    } else if (!/^\d{9}$/.test(this.telephone.replace(/\s/g, ''))) {
      this.errors['telephone'] = 'Le numéro doit contenir 9 chiffres (ex: 77 123 45 67).';
    }

    if (!this.email.trim()) {
      this.errors['email'] = "L'adresse email est requise.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.errors['email'] = "L'adresse email n'est pas valide.";
    }

    if (!this.motDePasse) {
      this.errors['motDePasse'] = 'Le mot de passe est requis.';
    } else if (this.motDePasse.length < 8) {
      this.errors['motDePasse'] = 'Le mot de passe doit contenir au moins 8 caractères.';
    } else if (!/[A-Z]/.test(this.motDePasse)) {
      this.errors['motDePasse'] = 'Le mot de passe doit contenir au moins 1 majuscule.';
    } else if (!/[0-9]/.test(this.motDePasse)) {
      this.errors['motDePasse'] = 'Le mot de passe doit contenir au moins 1 chiffre.';
    }

    return Object.keys(this.errors).length === 0;
  }

  goToStep2() {
    this.submitted = true;
    if (this.validateStep1()) {
      this.submitted = false;
      this.etape = 2;
    }
  }

  doRegister() {
    this.isLoading = true;
    // TODO : appel API Spring Boot /api/auth/register
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/connexion']);
    }, 1500);
  }

  // ── Force du mot de passe ───────────────────────────────────
  passwordStrength = 0;
  passwordColor    = '#e2e8f0';

  checkPassword() {
    const v = this.motDePasse;
    const s = v.length >= 8 ? 1 : 0;
    const u = /[A-Z]/.test(v) ? 1 : 0;
    const d = /[0-9]/.test(v) ? 1 : 0;
    this.passwordStrength = s + u + d;
    const colors = ['#ef4444', '#f59e0b', '#10b981'];
    this.passwordColor = this.passwordStrength > 0
      ? colors[this.passwordStrength - 1]
      : '#e2e8f0';

    // Effacer l'erreur mot de passe en temps réel si corrigée
    if (this.submitted && this.motDePasse) {
      if (this.motDePasse.length >= 8 && /[A-Z]/.test(this.motDePasse) && /[0-9]/.test(this.motDePasse)) {
        delete this.errors['motDePasse'];
      }
    }
  }

  // Effacer une erreur quand l'utilisateur commence à saisir
  clearError(field: string) {
    if (this.errors[field]) {
      delete this.errors[field];
    }
  }
}
