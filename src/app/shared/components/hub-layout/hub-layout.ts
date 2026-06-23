import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-hub-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './hub-layout.html',
  styleUrl: './hub-layout.scss',
})
export class HubLayout {
  @Input() active: 'dashboard' | 'reception' | 'plan' | 'tri' | 'preparation' | 'validation' | 'guichet' = 'dashboard';

  private authService = inject(Auth);

  get initiales(): string {
    return (this.authService.getNomComplet() || 'G')
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  logout() {
    this.authService.logout();
  }

  navItems = [
    { id: 'dashboard', route: '/hub/dashboard',     icon: 'ti-layout-dashboard',   label: 'Dashboard' },
    { id: 'reception', route: '/hub/reception',      icon: 'ti-package',            label: 'Réception' },
    { id: 'plan',      route: '/hub/plan',           icon: 'ti-building-warehouse', label: 'Stock / Plan' },
    { id: 'tri',       route: '/hub/tri',            icon: 'ti-truck',              label: 'Tri & Préparation' },
    { id: 'guichet',   route: '/hub/remise-guichet', icon: 'ti-hand-finger',        label: 'Guichet' },
  ];

  isActive(id: string): boolean {
    if (id === 'tri') {
      return ['tri', 'preparation', 'validation'].includes(this.active);
    }
    return this.active === id;
  }
}