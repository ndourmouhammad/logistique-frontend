import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';


@Component({
  selector: 'app-onboarding',
  imports: [CommonModule, RouterModule],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss',
})
export class Onboarding {
  currentSlide = 0;

  slides = [
    {
      icon: 'ti-package',
      title: 'Envoyez vos colis facilement',
      description: 'Créez une expédition en quelques secondes et suivez-la en temps réel.'
    },
    {
      icon: 'ti-map-pin',
      title: 'Suivi GPS en temps réel',
      description: 'Sachez exactement où se trouve votre colis à chaque instant.'
    },
    {
      icon: 'ti-shield-check',
      title: 'Livraison sécurisée',
      description: 'Validation par code OTP pour garantir la remise au bon destinataire.'
    }
  ];

  constructor(private router: Router) {}

  next() {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
    } else {
      this.router.navigate(['/connexion']);
    }
  }

  skip() {
    this.router.navigate(['/connexion']);
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }
}
