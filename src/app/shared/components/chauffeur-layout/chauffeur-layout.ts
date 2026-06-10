import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-chauffeur-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './chauffeur-layout.html',
  styleUrl: './chauffeur-layout.scss',
})
export class ChauffeurLayout {
  @Input() active: 'feuille' | 'historique' | 'scanner' | 'carte' | 'profil' = 'feuille';
  @Input() darkMode = false;
}
