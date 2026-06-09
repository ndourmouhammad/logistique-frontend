import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar],
  templateUrl: './client-layout.html'
})
export class ClientLayout {
  @Input() activeTab: 'dashboard' | 'expeditions' | 'tracking' | 'profil' = 'dashboard';

  constructor(private router: Router) {}

  navigate(route: string) {
    this.router.navigate([route]);
  }
}