import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LivreurService } from '../../../core/services/livreur';
import { ExpeditionListItem } from '../../../core/models/relais.model';

@Component({
  selector: 'app-validation-livraison',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './validation-livraison.html',
  styleUrl: './validation-livraison.scss',
})
export class ValidationLivraison implements OnInit {

  expedition    = signal<ExpeditionListItem | null>(null);
  codeColis     = signal('');
  nomDestinataire = signal('');
  telDestinataire = signal('');
  otpSaisi      = signal(['', '', '', '', '', '']); // 6 chiffres
  isLoading     = signal(false);
  modeHorsLigne = signal(false);
  erreurMessage = signal('');

  otpComplet = computed(() => this.otpSaisi().join(''));

  private livreurService = inject(LivreurService);
  private router = inject(Router);

  ngOnInit() {
    const data = sessionStorage.getItem('expeditionEnLivraison');
    if (data) {
      const e: ExpeditionListItem = JSON.parse(data);
      this.expedition.set(e);
      this.codeColis.set(e.codeTracking);
      this.nomDestinataire.set(e.nomDestinataire);
      this.telDestinataire.set(''); // pas dans ExpeditionListItem, OK
    } else {
      this.router.navigate(['/livreur/dashboard']);
    }
  }

  updateOtpValue(index: number, value: string) {
    const arr = [...this.otpSaisi()];
    arr[index] = value;
    this.otpSaisi.set(arr);
  }

  focusNext(index: number) {
    if (this.otpSaisi()[index] && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  }

  validerLivraison() {
    const expedition = this.expedition();
    if (!expedition) return;

    const otp = this.otpComplet();
    if (otp.length < 6) {
      this.erreurMessage.set('Veuillez saisir le code OTP complet (6 chiffres).');
      return;
    }

    this.isLoading.set(true);
    this.erreurMessage.set('');

    this.livreurService.validerLivraison(expedition.id, otp).subscribe({
      next: () => {
        this.isLoading.set(false);
        sessionStorage.removeItem('expeditionEnLivraison');
        this.router.navigate(['/livreur/dashboard']);
      },
      error: () => {
        this.isLoading.set(false);
        this.erreurMessage.set('Code OTP incorrect — livraison refusée.');
      }
    });
  }

  signalerEchec() {
    this.router.navigate(['/livreur/echec-livraison']);
  }
}