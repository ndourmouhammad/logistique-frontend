import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-echec-livraison',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './echec-livraison.html',
  styleUrl: './echec-livraison.scss',
})
export class EchecLivraison {
  codeColis       = signal('TT-DKR-4839');
  nomDestinataire = signal('Fatou Diallo');
  telDestinataire = signal('+221 77 845 12 34');
  adresse         = signal('Almadies, Zone 12 — Dakar');
  raisonEchec     = signal('ABSENT');
  commentaire     = signal('');
  nbTentatives    = signal(2);
  isLoading       = signal(false);
  showModal       = signal(false);

  raisons = [
    { value: 'ABSENT',    label: 'Client absent',         sousTitre: 'Personne ne répond à l\'adresse indiquée',  icon: 'ti-user-off' },
    { value: 'ADRESSE',   label: 'Adresse introuvable',   sousTitre: 'L\'adresse est incorrecte ou introuvable',  icon: 'ti-map-pin-off' },
    { value: 'REFUSE',    label: 'Client refuse le colis', sousTitre: 'Le destinataire refuse de recevoir le colis', icon: 'ti-hand-stop' },
    { value: 'ENDOMMAGE', label: 'Colis endommagé',       sousTitre: 'Le colis est abîmé ou ouvert',             icon: 'ti-package-off' },
    { value: 'ZONE',      label: 'Zone inaccessible',     sousTitre: 'Route bloquée, inondation, danger...',      icon: 'ti-road-off' },
    { value: 'AUTRE',     label: 'Autre motif',           sousTitre: 'Préciser dans le commentaire ci-dessous',   icon: 'ti-dots-circle-horizontal' },
  ];

  raisonLabel = computed(() => {
    return this.raisons.find(r => r.value === this.raisonEchec())?.label ?? 'Non spécifié';
  });

  get heureActuelle(): string {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
  }

  incrementerTentatives(delta: number) {
    const v = this.nbTentatives() + delta;
    if (v >= 0 && v <= 10) this.nbTentatives.set(v);
  }

  insertQuick(text: string) {
    this.commentaire.set(text);
  }

  constructor(private router: Router) {}

  signalerEchec() {
    this.isLoading.set(true);
    // TODO : appel API Spring Boot POST /api/livreur/expeditions/{id}/echec
    setTimeout(() => {
      this.isLoading.set(false);
      this.showModal.set(true);
    }, 1500);
  }

  retourDashboard() {
    this.router.navigate(['/livreur/dashboard']);
  }
}
