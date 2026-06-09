import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  @Input() role: 'admin' | 'hub' | 'relais' | 'livreur' | 'chauffeur' = 'admin';
  @Input() activeRoute = '';
  @Input() userNom = 'Utilisateur';
  @Input() userInitiales = 'U';

  constructor(private router: Router) {}

  get menuItems(): MenuItem[] {
    const menus: Record<string, MenuItem[]> = {
      admin: [
        { label: 'Dashboard',    icon: 'ti-dashboard',         route: '/admin/dashboard' },
        { label: 'Utilisateurs', icon: 'ti-users',             route: '/admin/utilisateurs' },
        { label: 'Flotte',       icon: 'ti-truck',             route: '/admin/flotte' },
        { label: 'Dispatch',     icon: 'ti-map-pins',          route: '/admin/dispatch' },
        { label: 'Incidents',    icon: 'ti-alert-triangle',    route: '/admin/incidents' },
        { label: 'Rapports',     icon: 'ti-chart-bar',         route: '/admin/rapports' },
        { label: 'Paramètres',   icon: 'ti-settings',          route: '/admin/parametres' },
      ],
      hub: [
        { label: 'Dashboard',    icon: 'ti-dashboard',         route: '/hub/dashboard' },
        { label: 'Réception',    icon: 'ti-package-import',    route: '/hub/reception' },
        { label: 'Stockage',     icon: 'ti-building-warehouse',route: '/hub/stockage' },
        { label: 'Tri & Départ', icon: 'ti-arrows-sort',       route: '/hub/tri' },
        { label: 'Expéditions',  icon: 'ti-truck',             route: '/hub/expeditions' },
      ],
      relais: [
        { label: 'Dashboard',    icon: 'ti-dashboard',         route: '/relais/dashboard' },
        { label: 'Réception',    icon: 'ti-package-import',    route: '/relais/reception' },
        { label: 'Mon stock',    icon: 'ti-archive',           route: '/relais/stock' },
        { label: 'Commissions',  icon: 'ti-coin',              route: '/relais/commissions' },
      ],
      livreur: [
        { label: 'Dashboard',    icon: 'ti-dashboard',         route: '/livreur/dashboard' },
        { label: 'Feuille route',icon: 'ti-route',             route: '/livreur/feuille-route' },
        { label: 'Mes gains',    icon: 'ti-wallet',            route: '/livreur/gains' },
      ],
      chauffeur: [
        { label: 'Dashboard',    icon: 'ti-dashboard',         route: '/chauffeur/dashboard' },
        { label: 'Mes trajets',  icon: 'ti-map-2',             route: '/chauffeur/trajets' },
        { label: 'Historique',   icon: 'ti-history',           route: '/chauffeur/historique' },
      ],
    };
    return menus[this.role] || [];
  }

  isActive(route: string): boolean {
    return this.activeRoute === route;
  }

  logout() {
    this.router.navigate(['/connexion']);
  }
}
