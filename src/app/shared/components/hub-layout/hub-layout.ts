import { Component, Input, inject, signal } from '@angular/core';
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
  @Input() active: 'dashboard' | 'reception' | 'plan' | 'tri' | 'preparation' | 'validation' | 'guichet' | 'profil' = 'dashboard';

  showConfirm = signal(false);

  private authService = inject(Auth);

  get initiales(): string {
    return (this.authService.getNomComplet() || 'G')
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  get nomComplet(): string {
    return this.authService.getNomComplet() || '';
  }

  demanderConfirmation() { this.showConfirm.set(true);  }
  annulerDeconnexion()   { this.showConfirm.set(false); }
  confirmerDeconnexion() { this.authService.logout();   }

  navItems = [
    { id: 'dashboard', route: '/hub/dashboard',     icon: 'ti-layout-dashboard',   label: 'Tableau de bord' },
    { id: 'reception', route: '/hub/reception',      icon: 'ti-package',            label: 'Réception colis' },
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