import { Component, Input, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth } from '../../../core/services/auth';

interface MenuItem {
  route: string;
  icon: string;
  label: string;
  inactiveIconColor?: string;
  inactiveTextColor?: string;
}

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout implements OnInit {
  principalMenu: MenuItem[] = [
    { route: '/admin/dashboard', icon: 'ti-layout-dashboard', label: 'Tableau de bord' },
    { route: '/admin/utilisateurs', icon: 'ti-users', label: 'Utilisateurs' },
    { route: '/admin/hubs', icon: 'ti-building-warehouse', label: 'Hubs' },
    { route: '/admin/relais', icon: 'ti-building-store', label: 'Relais' },
    { route: '/admin/flotte', icon: 'ti-truck', label: 'Flotte' },
    { route: '/admin/rapports', icon: 'ti-chart-bar', label: 'Rapports' },
  ];

  systemMenu: MenuItem[] = [
    { route: '/admin/parametres', icon: 'ti-settings', label: 'Paramètres' },
  ];
  @Input() badgeDispatch   = 0;
  @Input() badgeIncidents  = 0;

  userInitiales = signal('');
  userNom       = signal('');
  showConfirm   = signal(false);

  private authService = inject(Auth);

  ngOnInit() {
    const nom = this.authService.getNomComplet() || '';
    this.userNom.set(nom);
    this.userInitiales.set(
      nom.split(' ')
        .map(n => n.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase()
    );
  }

  demanderConfirmation() { this.showConfirm.set(true);  }
  annulerDeconnexion()   { this.showConfirm.set(false); }
  confirmerDeconnexion() { this.authService.logout();   }
}