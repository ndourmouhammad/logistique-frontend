import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  // Lien actif dans la navbar
  @Input() activeLink: 'dashboard' | 'expeditions' | 'tracking' | 'profil' | '' = '';
  // Afficher les liens de navigation (false pour les pages auth)
  @Input() showNav = true;
  // Afficher les boutons auth (Se connecter / Créer compte) pour l'accueil public
  @Input() showAuthButtons = false;
  // Initiales de l'utilisateur connecté
  @Input() userInitiales = 'MD';
}
