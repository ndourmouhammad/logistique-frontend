import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-inscription',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './inscription.html',
  styleUrl: './inscription.scss',
})
export class Inscription implements OnInit {
  inscriptionForm!: FormGroup;
  showPassword     = signal(false);
  isLoading        = signal(false);
  etape            = signal(1);
  submitted        = signal(false);
  erreurMessage    = signal('');
  successMessage   = signal('');

  // ── Inscription publique = CLIENT uniquement ─────────────────────────────
  // Les autres rôles sont créés par l'Admin (Semaine 2)
  roles = [
    { value: 'ROLE_CLIENT', label: 'Particulier (B2C)', icon: 'ti-user' },
    { value: 'ROLE_CLIENT', label: 'Entreprise (B2B)',  icon: 'ti-building' },
  ];

  passwordStrength = signal(0);
  passwordColor    = signal('#e2e8f0');

  private fb          = inject(FormBuilder);
  private router      = inject(Router);
  private authService = inject(Auth);

  ngOnInit() {
    this.inscriptionForm = this.fb.group({
      nomComplet: ['', [Validators.required, Validators.minLength(3)]],
      telephone:  ['', [Validators.required, Validators.pattern('^\\d{9}$')]],
      email:      ['', [Validators.required, Validators.email]],
      motDePasse: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordStrengthValidator
      ]],
      role: ['ROLE_CLIENT', Validators.required]
    });

    this.inscriptionForm.get('motDePasse')?.valueChanges.subscribe(value => {
      this.checkPassword(value);
    });
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    if (!/[A-Z]/.test(value)) return { requiresUppercase: true };
    if (!/[0-9]/.test(value)) return { requiresDigit: true };
    return null;
  }

  get f() { return this.inscriptionForm.controls; }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  checkPassword(v: string) {
    if (!v) { this.passwordStrength.set(0); this.passwordColor.set('#e2e8f0'); return; }
    const s = v.length >= 8 ? 1 : 0;
    const u = /[A-Z]/.test(v) ? 1 : 0;
    const d = /[0-9]/.test(v) ? 1 : 0;
    this.passwordStrength.set(s + u + d);
    const colors = ['#ef4444', '#f59e0b', '#10b981'];
    this.passwordColor.set(this.passwordStrength() > 0 ? colors[this.passwordStrength() - 1] : '#e2e8f0');
  }

  goToStep2() {
    this.submitted.set(true);
    const { nomComplet, telephone, email, motDePasse } = this.f;
    if (nomComplet.valid && telephone.valid && email.valid && motDePasse.valid) {
      this.submitted.set(false);
      // ── Étape 2 (OTP SMS) ignorée pour l'instant → passe directement à l'étape 3
      this.etape.set(3);
    }
  }

  doRegister() {
    this.isLoading.set(true);
    this.erreurMessage.set('');

    const { nomComplet, telephone, email, motDePasse } = this.inscriptionForm.value;

    const request = {
      nomComplet,
      telephone: '+221' + telephone,
      email,
      motDePasse,
      role: 'ROLE_CLIENT'  // toujours CLIENT pour l'inscription publique
    };

    this.authService.register(request).subscribe({
      next: () => {
        // Connexion automatique après inscription réussie
        this.authService.login({ email, motDePasse }).subscribe({
          next: () => {
            this.isLoading.set(false);
            this.authService.redirectByRole();
          },
          error: () => {
            this.isLoading.set(false);
            this.router.navigate(['/connexion']);
          }
        });
      },
      error: (err) => {
        this.isLoading.set(false);
        
        // ── Lire le message texte renvoyé par le backend ─────────────────────
        const message = err.error;
        
        if (typeof message === 'string' && message.includes('email')) {
          this.erreurMessage.set('Un compte existe déjà avec cet email.');
        } else if (typeof message === 'string' && message.includes('téléphone')) {
          this.erreurMessage.set('Ce numéro de téléphone est déjà utilisé.');
        } else {
          this.erreurMessage.set('Erreur lors de la création du compte. Réessayez.');
        }
      }
    });
  }
}
