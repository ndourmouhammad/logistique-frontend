import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { LoginRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-connexion',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './connexion.html',
  styleUrl: './connexion.scss',
})
export class Connexion implements OnInit {
  connexionForm!: FormGroup;
  showPassword   = signal(false);
  isLoading      = signal(false);
  erreurMessage  = signal('');
  submitted      = signal(false);

  private authService = inject(Auth);
  private fb = inject(FormBuilder);

  ngOnInit() {
    this.connexionForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', Validators.required]
    });
  }

  get f() { return this.connexionForm.controls; }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  doLogin() {
    this.submitted.set(true);
    if (this.connexionForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.erreurMessage.set('');

    const request: LoginRequest = {
      email: this.connexionForm.value.email,
      motDePasse: this.connexionForm.value.motDePasse
    };

    this.authService.login(request).subscribe({
      next: () => {
        this.isLoading.set(false);
        // Redirection automatique selon le rôle
        this.authService.redirectByRole();
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = (err.error?.message || err.error || err.message || '').toString().toLowerCase();
        
        if (err.status === 401 || err.status === 403 || err.status === 400 || err.status === 500 || msg.includes('bad credentials')) {
          this.erreurMessage.set('Email ou mot de passe incorrect.');
        } else {
          this.erreurMessage.set('Erreur serveur. Réessayez plus tard.');
        }
      }
    });
  }
}
