import { Component, Input, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout implements OnInit {
  @Input() active: 'dashboard' | 'utilisateurs' | 'flotte' | 'dispatch' | 'incidents' | 'rapports' | 'parametres' = 'dashboard';
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