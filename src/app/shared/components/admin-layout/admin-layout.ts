import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {
  @Input() active: 'dashboard' | 'utilisateurs' | 'flotte' | 'dispatch' | 'incidents' | 'rapports' | 'parametres' = 'dashboard';
  @Input() userInitiales = 'AD';
  @Input() userNom = 'Admin Sène';
  @Input() userRole = 'Super Admin';
  @Input() badgeDispatch = 5;
  @Input() badgeIncidents = 2;
}
