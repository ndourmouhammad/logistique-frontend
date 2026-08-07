import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-accueil',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './accueil.html',
  styleUrl: './accueil.scss',
})
export class Accueil {
  mobileMenuOpen = false;
  sectionActive = signal('accueil');

  
  villeDepart  = 'Dakar';
  villeArrivee = 'Diourbel';
  poids        = 2.5;
  service      = signal('Standard');
  estimation   = 2300; 

  villes = ['Dakar', 'Thiès', 'Diourbel', 'Touba'];

  // Grille tarifaire exacte (Modèle Financier)
  private readonly TARIFS_GRID: Record<string, Record<string, { '0-5': number; '5-20': number; '20-50': number }>> = {
    Dakar: {
      Dakar:     { '0-5': 1000, '5-20': 2000, '20-50': 3500 },
      'Thiès':    { '0-5': 1300, '5-20': 3500, '20-50': 6700 },
      Diourbel:  { '0-5': 2300, '5-20': 4500, '20-50': 8700 },
      Touba:     { '0-5': 2800, '5-20': 6500, '20-50': 8700 }
    },
    'Thiès': {
      Dakar:     { '0-5': 1300, '5-20': 3500, '20-50': 6700 },
      'Thiès':    { '0-5': 1000, '5-20': 2000, '20-50': 3500 },
      Diourbel:  { '0-5': 1800, '5-20': 3500, '20-50': 7700 },
      Touba:     { '0-5': 2300, '5-20': 4500, '20-50': 5700 }
    },
    Diourbel: {
      Dakar:     { '0-5': 2300, '5-20': 4500, '20-50': 8700 },
      'Thiès':    { '0-5': 1800, '5-20': 3500, '20-50': 7700 },
      Diourbel:  { '0-5': 1000, '5-20': 2000, '20-50': 3500 },
      Touba:     { '0-5': 1300, '5-20': 3000, '20-50': 4700 }
    },
    Touba: {
      Dakar:     { '0-5': 2800, '5-20': 6500, '20-50': 8700 },
      'Thiès':    { '0-5': 2300, '5-20': 4500, '20-50': 5700 },
      Diourbel:  { '0-5': 1300, '5-20': 3000, '20-50': 4700 },
      Touba:     { '0-5': 1000, '5-20': 2000, '20-50': 3500 }
    }
  };

  // ── Suivi rapide ───────────────────────────────────────────────
  codeTracking = '';

  // ── Témoignages ────────────────────────────────────────────────
  temoignages = [
    {
      nom: 'Bineta Sall',
      role: 'E-commerçante · Dakar',
      message: 'Grâce à KolisGo, mes clients reçoivent leurs commandes en 24h. Mon taux de satisfaction a explosé !',
      note: 5
    },
    {
      nom: 'Mamadou Ngom',
      role: 'Particulier · Diourbel',
      message: 'J\'ai envoyé un colis à ma famille à Diourbel, tout s\'est passé sans accroc. Le suivi GPS c\'est top !',
      note: 5
    },
    {
      nom: 'Fatou Sow',
      role: 'Artisane · Thiès',
      message: 'Simple, rapide, et pas cher. Le paiement Orange Money me facilite vraiment la vie au quotidien.',
      note: 4
    }
  ];

  constructor(private router: Router) {}

  @HostListener('window:scroll')
  onScroll() {
    const sections = ['temoignages', 'tarifs', 'services'];
    const navbarOffset = 80;
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= navbarOffset && rect.bottom > navbarOffset) {
          this.sectionActive.set(id);
          return;
        }
      }
    }
    this.sectionActive.set('accueil');
  }

  scrollTo(id: string) {
    this.sectionActive.set(id);
    if (id === 'accueil') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const navbarHeight = 64;
      const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  calculerEstimation() {
    const dep = this.villeDepart;
    const arr = this.villeArrivee;
    const routes = this.TARIFS_GRID[dep] || this.TARIFS_GRID['Dakar'];
    const rates = routes[arr] || routes[dep] || { '0-5': 1000, '5-20': 2000, '20-50': 3500 };

    let categorie: '0-5' | '5-20' | '20-50' = '0-5';
    if (this.poids > 20) {
      categorie = '20-50';
    } else if (this.poids > 5) {
      categorie = '5-20';
    }

    let base = rates[categorie];

    if (this.service() === 'Express') {
      base = base * 1.3;
    }

    this.estimation = Math.round(base);
  }

  choisirService(s: string) {
    this.service.set(s);
    this.calculerEstimation();
  }

  rechercherColis() {
    if (this.codeTracking.trim()) {
      this.router.navigate(['/client/tracking'], { queryParams: { code: this.codeTracking } });
    }
  }

  creerExpedition() {
    this.router.navigate(['/client/expedition']);
  }
}
