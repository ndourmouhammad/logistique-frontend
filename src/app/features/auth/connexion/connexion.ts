import { Component, inject, OnInit } from '@angular/core';
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
  showPassword   = false;
  isLoading      = false;
  erreurMessage  = '';
  submitted      = false;

  private authService = inject(Auth);
  private fb = inject(FormBuilder);

  ngOnInit() {
    this.connexionForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', Validators.required],
      resterConnecte: [false]
    });
  }

  get f() { return this.connexionForm.controls; }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  doLogin() {
    this.submitted = true;
    if (this.connexionForm.invalid) {
      return;
    }

    this.isLoading     = true;
    this.erreurMessage = '';

    const request: LoginRequest = {
      email: this.connexionForm.value.email,
      motDePasse: this.connexionForm.value.motDePasse
    };

    this.authService.login(request).subscribe({
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
