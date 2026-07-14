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

  // ── Estimateur ──────────────────────────────────────────────────
  villeDepart  = 'Dakar';
  villeArrivee = 'Diourbel';
  poids        = 2.5;
  service      = signal('Standard');
  estimation   = 2500;

  villes = ['Dakar', 'Thiès', 'Diourbel', 'Touba'];

  // ── Suivi rapide ───────────────────────────────────────────────
  codeTracking = '';

  // ── Témoignages ────────────────────────────────────────────────
  temoignages = [
    {
      nom: 'Aminata Diallo',
      role: 'E-commerçante · Dakar',
      message: 'Grâce à KolisGo, mes clients reçoivent leurs commandes en 24h. Mon taux de satisfaction a explosé !',
      note: 5
    },
    {
      nom: 'Moussa Ndiaye',
      role: 'Particulier · Saint-Louis',
      message: 'J\'ai envoyé un colis à ma famille à Ziguinchor, tout s\'est passé sans accroc. Le suivi GPS c\'est top !',
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
    const base = 1500 + (this.poids * 400) + (this.service() === 'Express' ? 800 : 0);
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
