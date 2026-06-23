import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-chauffeur-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './chauffeur-layout.html',
  styleUrl: './chauffeur-layout.scss',
})
export class ChauffeurLayout {
  @Input() active: 'feuille' | 'historique' | 'scanner' | 'carte' | 'profil' = 'feuille';
  @Input() darkMode = false;

  private authService = inject(Auth);

  get initiales(): string {
    return (this.authService.getNomComplet() || 'C')
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
}