import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

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

  constructor(private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  doLogin() {
    this.isLoading = true;
    // TODO : appel API Spring Boot
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/client/dashboard']);
    }, 1500);
  }
}
