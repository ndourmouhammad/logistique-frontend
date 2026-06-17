import { Component, computed, signal } from '@angular/core';
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
  codeColis       = signal('TT-DKR-4839');
  nomDestinataire = signal('Fatou Diallo');
  telDestinataire = signal('+221 77 845 12 34');
  otpSaisi        = signal(['', '', '', '']);
  isLoading       = signal(false);
  modeHorsLigne   = signal(false);

  constructor(private router: Router) {}

  otpComplet = computed(() => this.otpSaisi().join(''));

  updateOtpValue(index: number, value: string) {
    const arr = [...this.otpSaisi()];
    arr[index] = value;
    this.otpSaisi.set(arr);
  }

  focusNext(index: number) {
    if (this.otpSaisi()[index] && index < 3) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  }

  validerLivraison() {
    this.isLoading.set(true);
    // TODO : appel API Spring Boot POST /api/livreur/expeditions/{id}/livrer
    setTimeout(() => {
      this.isLoading.set(false);
      this.router.navigate(['/livreur/dashboard']);
    }, 1500);
  }

  signalerEchec() {
    this.router.navigate(['/livreur/echec-livraison']);
  }
}
