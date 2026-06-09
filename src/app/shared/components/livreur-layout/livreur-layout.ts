import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-livreur-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './livreur-layout.html',
  styleUrl: './livreur-layout.scss',
})
export class LivreurLayout {
  @Input() active: 'home' | 'historique' | 'scanner' | 'profil' = 'home';
}
