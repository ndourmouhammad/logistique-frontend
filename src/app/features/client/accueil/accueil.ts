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
      Dakar:     { '0-5': 0, '5-20': 0, '20-50': 0 },
      'Thiès':    { '0-5': 1000, '5-20': 3000, '20-50': 6000 },
      Diourbel:  { '0-5': 2000, '5-20': 4000, '20-50': 8000 },
      Touba:     { '0-5': 2500, '5-20': 6000, '20-50': 8000 }
    },
    'Thiès': {
      Dakar:     { '0-5': 1000, '5-20': 3000, '20-50': 6000 },
      'Thiès':    { '0-5': 0, '5-20': 0, '20-50': 0 },
      Diourbel:  { '0-5': 1500, '5-20': 3000, '20-50': 7000 },
      Touba:     { '0-5': 2000, '5-20': 4000, '20-50': 5000 }
    },
    Diourbel: {
      Dakar:     { '0-5': 2000, '5-20': 4000, '20-50': 8000 },
      'Thiès':    { '0-5': 1500, '5-20': 3000, '20-50': 7000 },
      Diourbel:  { '0-5': 0, '5-20': 0, '20-50': 0 },
      Touba:     { '0-5': 1000, '5-20': 2500, '20-50': 4000 }
    },
    Touba: {
      Dakar:     { '0-5': 2500, '5-20': 6000, '20-50': 8000 },
      'Thiès':    { '0-5': 2000, '5-20': 4000, '20-50': 5000 },
      Diourbel:  { '0-5': 1000, '5-20': 2500, '20-50': 4000 },
      Touba:     { '0-5': 0, '5-20': 0, '20-50': 0 }
    }
  };

  private readonly FRAIS_SUPP_GRID: Record<string, { '0-5': number; '5-20': number; '20-50': number }> = {
    Dakar:    { '0-5': 1000, '5-20': 1200, '20-50': 1400 },
    'Thiès':   { '0-5': 700,  '5-20': 900,  '20-50': 1100 },
    Diourbel: { '0-5': 500,  '5-20': 700,  '20-50': 900 },
    Touba:    { '0-5': 500,  '5-20': 700,  '20-50': 900 }
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
    const destination = this.TARIFS_GRID[this.villeDepart][this.villeArrivee];
    
    let tranche: '0-5' | '5-20' | '20-50' = '0-5';
    if (this.poids > 20) {
      tranche = '20-50';
    } else if (this.poids > 5) {
      tranche = '5-20';
    }

    const tarifBase = destination[tranche] || 1500;

    let total = tarifBase;

    // Majoration Express (+30%)
    if (this.service() === 'Express') {
      total = total * 1.30;
    }

    this.estimation = Math.round(total);
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
