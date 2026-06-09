import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-nouvelle-course',
  imports: [CommonModule, RouterModule],
  templateUrl: './nouvelle-course.html',
  styleUrl: './nouvelle-course.scss',
})
export class NouvelleCourse {
  countdown   = 29;
  montant     = 1200;
  distance    = 2.5;
  poids       = 1.5;
  adresseEnlevement = 'Sacré-Cœur 3, Villa 142';
  adresseDepot      = 'Hub Dakar Nord';

  constructor(private router: Router) {}

  accepter() {
    this.router.navigate(['/livreur/dashboard']);
  }

  refuser() {
    this.router.navigate(['/livreur/dashboard']);
  }
}
