import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HubLayout } from '../../../shared/components/hub-layout/hub-layout';
import { HubService } from '../../../core/services/hub';
import { RelaisService } from '../../../core/services/relais';
import { HubContext } from '../../../core/services/hub-context';
import { ExpeditionGuichetRequest } from '../../../core/models/expedition.model';
import { PointRelaisListItem } from '../../../core/models/relais.model';
import { HubResponse } from '../../../core/models/hub.model';

@Component({
  selector: 'app-creation-expedition-guichet',
  imports: [CommonModule, FormsModule, HubLayout],
  templateUrl: './creation-expedition-guichet.html',
  styleUrl: './creation-expedition-guichet.scss',
})
export class CreationExpeditionGuichet implements OnInit {

  private hubService = inject(HubService);
  private relaisService = inject(RelaisService);
  public hubContext = inject(HubContext);
  private router = inject(Router);

  isSubmitting = signal(false);
  successMessage = signal('');
  erreurMessage = signal('');
  showRecap = signal(false);

  pointsRelais = signal<PointRelaisListItem[]>([]);
  hubs = signal<HubResponse[]>([]);
  villeRecherche = signal('');
  rechercheEnCours = signal(false);

  form = signal<ExpeditionGuichetRequest>({
    nomClient: '',
    telephoneClient: '',
    emailClient: '',
    nomDestinataire: '',
    telephoneDestinataire: '',
    emailDestinataire: '',
    poids: 1,
    volume: 0.1,
    descriptionContenu: '',
    modeLivraison: 'RETRAIT_HUB',
    pointRelaisDestinationId: undefined,
    hubDestinationId: undefined,
    rue: '',
    ville: '',
    region: '',
    codePostal: '',
    pays: 'Sénégal',
    hubId: 0
  });

  // ── Grille tarifaire (identique au modèle financier) ──────────────
  private readonly TARIFS_GRID: Record<string, Record<string, { '0-5': number; '5-20': number; '20-50': number }>> = {
    Dakar: {
      Dakar:     { '0-5': 1000, '5-20': 2000, '20-50': 3500 },
      'Thiès':   { '0-5': 1300, '5-20': 3500, '20-50': 6700 },
      Diourbel:  { '0-5': 2300, '5-20': 4500, '20-50': 8700 },
      Touba:     { '0-5': 2800, '5-20': 6500, '20-50': 8700 }
    },
    'Thiès': {
      Dakar:     { '0-5': 1300, '5-20': 3500, '20-50': 6700 },
      'Thiès':   { '0-5': 1000, '5-20': 2000, '20-50': 3500 },
      Diourbel:  { '0-5': 1800, '5-20': 3500, '20-50': 7700 },
      Touba:     { '0-5': 2300, '5-20': 4500, '20-50': 5700 }
    },
    Diourbel: {
      Dakar:     { '0-5': 2300, '5-20': 4500, '20-50': 8700 },
      'Thiès':   { '0-5': 1800, '5-20': 3500, '20-50': 7700 },
      Diourbel:  { '0-5': 1000, '5-20': 2000, '20-50': 3500 },
      Touba:     { '0-5': 1300, '5-20': 3000, '20-50': 4700 }
    },
    Touba: {
      Dakar:     { '0-5': 2800, '5-20': 6500, '20-50': 8700 },
      'Thiès':   { '0-5': 2300, '5-20': 4500, '20-50': 5700 },
      Diourbel:  { '0-5': 1300, '5-20': 3000, '20-50': 4700 },
      Touba:     { '0-5': 1000, '5-20': 2000, '20-50': 3500 }
    }
  };

  ngOnInit() {
    this.chargerHubs();
  }

  chargerHubs() {
    this.hubService.getTousLesHubs().subscribe({
      next: (data) => {
        this.hubs.set(data);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des hubs:', err);
      }
    });
  }

  // ── Estimation du prix ────────────────────────────────────────────
  prixEstime = computed(() => {
    const f = this.form();
    const villeDepart = this.hubContext.villeHub;
    let villeArrivee = villeDepart; // par défaut même ville (retrait hub local)

    if (f.modeLivraison === 'RETRAIT_HUB' && f.hubDestinationId) {
      const destHub = this.hubs().find(h => h.id === f.hubDestinationId);
      if (destHub) {
        villeArrivee = destHub.ville;
      }
    } else if (f.modeLivraison === 'LIVRAISON_DOMICILE' && f.ville) {
      villeArrivee = f.ville;
    } else if (f.modeLivraison === 'RETRAIT_RELAIS' && this.villeRecherche()) {
      villeArrivee = this.villeRecherche();
    }

    const routes = this.TARIFS_GRID[villeDepart] || this.TARIFS_GRID['Dakar'];
    const rates = routes[villeArrivee] || routes[villeDepart] || { '0-5': 1000, '5-20': 2000, '20-50': 3500 };

    let categorie: '0-5' | '5-20' | '20-50' = '0-5';
    if (f.poids > 20) {
      categorie = '20-50';
    } else if (f.poids > 5) {
      categorie = '5-20';
    }

    return rates[categorie];
  });

  // ── Labels lisibles ───────────────────────────────────────────────
  get modeLivraisonLabel(): string {
    const labels: Record<string, string> = {
      'RETRAIT_HUB': 'Retrait au Hub',
      'RETRAIT_RELAIS': 'Point Relais',
      'LIVRAISON_DOMICILE': 'Livraison à Domicile'
    };
    return labels[this.form().modeLivraison] || this.form().modeLivraison;
  }

  get pointRelaisNom(): string {
    const id = this.form().pointRelaisDestinationId;
    if (!id) return '';
    const pr = this.pointsRelais().find(p => p.id === id);
    return pr ? `${pr.nomEnseigne} (${pr.ville})` : `#${id}`;
  }

  get hubDestinationNom(): string {
    const id = this.form().hubDestinationId;
    if (!id) return '';
    const h = this.hubs().find((hub: HubResponse) => hub.id === id);
    return h ? `${h.nom} (${h.ville})` : `#${id}`;
  }

  updateForm(field: string, value: any) {
    this.form.update(f => ({ ...f, [field]: value }));
  }

  rechercherPointsRelais() {
    const ville = this.villeRecherche().trim();
    if (!ville) {
      this.pointsRelais.set([]);
      return;
    }

    this.rechercheEnCours.set(true);
    this.relaisService.getPointsRelaisParVille(ville).subscribe({
      next: (data) => {
        this.pointsRelais.set(data);
        this.rechercheEnCours.set(false);
      },
      error: () => {
        this.pointsRelais.set([]);
        this.rechercheEnCours.set(false);
      }
    });
  }

  // ── Étape 1 : Valider le formulaire et afficher le récapitulatif ──
  allerAuRecap() {
    const f = this.form();
    f.hubId = this.hubContext.hubId;

    if (!f.nomClient || !f.telephoneClient || !f.nomDestinataire || !f.telephoneDestinataire || !f.descriptionContenu) {
      this.erreurMessage.set('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (f.modeLivraison === 'RETRAIT_HUB' && !f.hubDestinationId) {
      this.erreurMessage.set('Veuillez sélectionner un hub de destination.');
      return;
    }

    if (f.modeLivraison === 'RETRAIT_RELAIS' && !f.pointRelaisDestinationId) {
      this.erreurMessage.set('Veuillez sélectionner un point relais de destination.');
      return;
    }

    if (f.modeLivraison === 'LIVRAISON_DOMICILE' && (!f.rue || !f.ville)) {
      this.erreurMessage.set('Veuillez renseigner la rue et la ville pour la livraison à domicile.');
      return;
    }

    this.erreurMessage.set('');
    this.showRecap.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Retour au formulaire depuis le récap ──────────────────────────
  retourFormulaire() {
    this.showRecap.set(false);
  }

  // ── Étape 2 : Confirmation et envoi ───────────────────────────────
  confirmerExpedition() {
    const f = this.form();
    f.hubId = this.hubContext.hubId;

    this.isSubmitting.set(true);
    this.erreurMessage.set('');

    this.hubService.enregistrerExpeditionGuichet(f).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.showRecap.set(false);
        this.successMessage.set(`Expédition ${res.codeTracking} enregistrée avec succès !`);

        setTimeout(() => {
          this.router.navigate(['/hub/dashboard']);
        }, 3000);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.erreurMessage.set('Erreur lors de la création de l\'expédition.');
        console.error(err);
      }
    });
  }
}

