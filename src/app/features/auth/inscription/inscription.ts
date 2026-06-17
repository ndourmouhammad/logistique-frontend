import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { RegisterRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-inscription',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './inscription.html',
  styleUrl: './inscription.scss',
})
export class Inscription implements OnInit {
  inscriptionForm!: FormGroup;
  showPassword   = signal(false);
  isLoading      = signal(false);
  etape          = signal(1);
  submitted      = signal(false);

  roles = [
    { value: 'ROLE_CLIENT',          label: 'Client',           icon: 'ti-user' },
    { value: 'ROLE_LIVREUR',         label: 'Livreur',          icon: 'ti-motorbike' },
    { value: 'ROLE_CHAUFFEUR',       label: 'Chauffeur',        icon: 'ti-truck' },
    { value: 'ROLE_GESTIONNAIRE_HUB',label: 'Gestionnaire Hub', icon: 'ti-building-warehouse' },
    { value: 'ROLE_GERANT_RELAIS',   label: 'Gérant Relais',    icon: 'ti-building-store' },
  ];

  passwordStrength = signal(0);
  passwordColor    = signal('#e2e8f0');

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.inscriptionForm = this.fb.group({
      nomComplet: ['', [Validators.required, Validators.minLength(3)]],
      telephone: ['', [Validators.required, Validators.pattern('^\\d{9}$')]],
      email: ['', [Validators.required, Validators.email]],
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
    if (!v) {
      this.passwordStrength.set(0);
      this.passwordColor.set('#e2e8f0');
      return;
    }
    const s = v.length >= 8 ? 1 : 0;
    const u = /[A-Z]/.test(v) ? 1 : 0;
    const d = /[0-9]/.test(v) ? 1 : 0;
    this.passwordStrength.set(s + u + d);
    const colors = ['#ef4444', '#f59e0b', '#10b981'];
    this.passwordColor.set(this.passwordStrength() > 0
      ? colors[this.passwordStrength() - 1]
      : '#e2e8f0');
  }

  goToStep2() {
    this.submitted.set(true);
    if (this.f['nomComplet'].valid && this.f['telephone'].valid && this.f['email'].valid && this.f['motDePasse'].valid) {
      this.submitted.set(false);
      this.etape.set(2);
    }
  }

  doRegister() {
    this.isLoading.set(true);
    const request: RegisterRequest = this.inscriptionForm.value;
    // TODO : appel API Spring Boot /api/auth/register avec request
    setTimeout(() => {
      this.isLoading.set(false);
      this.router.navigate(['/connexion']);
    }, 1500);
  }
}
