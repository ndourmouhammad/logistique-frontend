import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-relais-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './relais-layout.html',
  styleUrl: './relais-layout.scss',
})
export class RelaisLayout {
  @Input() active: 'dashboard' | 'reception' | 'stock' | 'remise' | 'commissions' = 'dashboard';
  @Input() userInitiales = 'PN';
  @Input() userNom       = 'Papa Ndiaye';
  @Input() nbStock       = 8;
}
