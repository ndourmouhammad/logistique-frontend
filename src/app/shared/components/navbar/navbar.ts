import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  @Input() activeLink: 'dashboard' | 'expeditions' | 'tracking' | 'profil' | '' = '';
  @Input() showNav = true;
  @Input() showAuthButtons = false;
  @Input() userInitiales = 'MD';
  @Input() nomComplet = '';

  showDropdown = signal(false);

  private authService = inject(Auth);

  toggleDropdown() {
    this.showDropdown.update(v => !v);
  }

  logout() {
    this.authService.logout();
  }
}