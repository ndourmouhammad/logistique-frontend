import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';

@Component({
  selector: 'app-validation-otp',
  imports: [CommonModule, RouterModule, ClientLayout],
  templateUrl: './validation-otp.html',
  styleUrl: './validation-otp.scss',
})
export class ValidationOtp {
  otpCode      = '8439';
  codeTracking = 'TT-DKR-4839';
  nomLivreur   = 'Ibrahima Balde';
  isLoading    = signal(false);

  private router = inject(Router);

  confirmerReception() {
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.router.navigate(['/client/dashboard']);
    }, 1500);
  }
}
