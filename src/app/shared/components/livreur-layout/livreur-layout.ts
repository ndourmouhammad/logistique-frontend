import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-livreur-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './livreur-layout.html',
  styleUrl: './livreur-layout.scss',
})
export class LivreurLayout {
  @Input() active: 'home' | 'historique' | 'scanner' | 'profil' = 'home';

  private authService = inject(Auth);

  logout() {
    this.authService.logout();
  }
}