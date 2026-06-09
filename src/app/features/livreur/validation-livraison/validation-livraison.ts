import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-validation-livraison',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './validation-livraison.html',
  styleUrl: './validation-livraison.scss',
})
export class ValidationLivraison {
  codeColis       = 'TT-DKR-4839';
  nomDestinataire = 'Fatou Diallo';
  telDestinataire = '+221 77 845 12 34';
  otpSaisi        = ['', '', '', ''];
  isLoading       = false;
  modeHorsLigne   = false;

  constructor(private router: Router) {}

  get otpComplet(): string {
    return this.otpSaisi.join('');
  }

  focusNext(index: number) {
    if (this.otpSaisi[index] && index < 3) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  }

  validerLivraison() {
    this.isLoading = true;
    // TODO : appel API Spring Boot POST /api/livreur/expeditions/{id}/livrer
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/livreur/dashboard']);
    }, 1500);
  }

  signalerEchec() {
    this.router.navigate(['/livreur/echec-livraison']);
  }
}

