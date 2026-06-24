import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { signal } from '@angular/core';

@Component({
  selector: 'app-relais-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './relais-layout.html',
  styleUrl: './relais-layout.scss',
})
export class RelaisLayout implements OnInit {
  @Input() active: 'dashboard' | 'reception' | 'stock' | 'remise' | 'commissions' | 'profil' = 'dashboard';
  @Input() nbStock = 0;

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