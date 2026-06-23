import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar],
  templateUrl: './client-layout.html'
})
export class ClientLayout {
  @Input() activeTab: 'dashboard' | 'expeditions' | 'tracking' | 'profil' = 'dashboard';

  private authService = inject(Auth);

  get nomComplet(): string {
    return this.authService.getNomComplet() || '';
  }

  get initiales(): string {
    return this.nomComplet
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
}