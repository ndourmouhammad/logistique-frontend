import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { EstimationResponse, ExpeditionService } from '../../../core/services/expedition';
import { Auth } from '../../../core/services/auth';
import { debounceTime, Subject, switchMap } from 'rxjs';


@Component({
  selector: 'app-expedition',
  imports: [CommonModule, RouterModule, FormsModule, ClientLayout],
  templateUrl: './expedition.html',
  styleUrl: './expedition.scss',
})
export class Expedition {
  // Formulaire
  adresseDepart      = '';
  quartierDepart     = '';
  villeDepart        = 'Dakar';
  nomExpediteur      = '';
  telExpediteur      = '';
  nomDestinataire    = '';
  telDestinataire    = '';
  rue                = '';
  quartierArrivee    = '';
  ville              = 'Thiès';
  region             = '';
  codePostal         = '';
  pays               = 'Sénégal';
  descriptionContenu = '';
  poids              = 0;
  volume             = 0;
  estExpress         = false;
  avecRamassage      = false;
  assurance          = false;
  valeurDeclaree     = 0;
  methodePaiement    = 'WAVE';

  // Estimation depuis le backend
  estimation: EstimationResponse = {
    fraisTransport: 1500,
    fraisRamassage: 0,
    fraisAssurance: 0,
    total:          1500
  };

  isLoading    = false;
  isEstimating = false;
  erreurMessage = '';

  villes = ['Dakar', 'Thiès', 'Diourbel', 'Touba', 'Bambey', 'Mbacke Baol'];

  // Subject pour le debounce
  private estimationTrigger$ = new Subject<void>();


  private expeditionService = inject(ExpeditionService);
  private authService = inject(Auth);
  private router = inject(Router);

  ngOnInit() {
    // Restaurer le formulaire s'il existe dans le sessionStorage
    const savedForm = sessionStorage.getItem('formulaireExpedition');
    if (savedForm) {
      try {
        const data = JSON.parse(savedForm);
        this.adresseDepart = data.adresseDepart || '';
        this.quartierDepart = data.quartierDepart || '';
        this.villeDepart = data.villeDepart || 'Dakar';
        this.nomExpediteur = data.nomExpediteur || '';
        this.telExpediteur = data.telExpediteur || '';
        this.nomDestinataire = data.nomDestinataire || '';
        this.telDestinataire = data.telDestinataire || '';
        this.rue = data.rue || '';
        this.quartierArrivee = data.quartierArrivee || '';
        this.ville = data.ville || 'Thiès';
        this.region = data.region || '';
        this.codePostal = data.codePostal || '';
        this.pays = data.pays || 'Sénégal';
        this.descriptionContenu = data.descriptionContenu || '';
        this.poids = data.poids || 0;
        this.volume = data.volume || 0;
        this.estExpress = data.estExpress || false;
        this.avecRamassage = data.avecRamassage || false;
        this.assurance = data.assurance || false;
        this.valeurDeclaree = data.valeurDeclaree || 0;
        this.methodePaiement = data.methodePaiement || 'WAVE';
      } catch (e) {
        console.error('Erreur lors de la restauration du formulaire', e);
      }
    }

    // Appel API avec debounce 400ms
    this.estimationTrigger$
      .pipe(
        debounceTime(400),
        switchMap(() => {
          this.isEstimating = true;
          return this.expeditionService.estimerTarif({
            poids:          this.poids          || 0,
            volume:         this.volume         || 0,
            estExpress:     this.estExpress,
            avecRamassage:  this.avecRamassage,
            assurance:      this.assurance,
            valeurDeclaree: this.valeurDeclaree || 0,
          });
        })
      )
      .subscribe({
        next: (data) => {
          this.estimation   = data;
          this.isEstimating = false;
        },
        error: () => {
          this.isEstimating = false;
        }
      });

    // Charger l'estimation initiale au chargement
    this.onOptionsChange();
  }

  // Déclencher l'estimation à chaque changement
  onOptionsChange() {
    this.estimationTrigger$.next();
  }

  soumettre() {
    this.isLoading     = true;
    this.erreurMessage = '';

    // Sauvegarder le formulaire pour la restauration en cas de retour en arrière
    const formData = {
      adresseDepart: this.adresseDepart,
      quartierDepart: this.quartierDepart,
      villeDepart: this.villeDepart,
      nomExpediteur: this.nomExpediteur,
      telExpediteur: this.telExpediteur,
      nomDestinataire: this.nomDestinataire,
      telDestinataire: this.telDestinataire,
      rue: this.rue,
      quartierArrivee: this.quartierArrivee,
      ville: this.ville,
      region: this.region,
      codePostal: this.codePostal,
      pays: this.pays,
      descriptionContenu: this.descriptionContenu,
      poids: this.poids,
      volume: this.volume,
      estExpress: this.estExpress,
      avecRamassage: this.avecRamassage,
      assurance: this.assurance,
      valeurDeclaree: this.valeurDeclaree,
      methodePaiement: this.methodePaiement
    };
    sessionStorage.setItem('formulaireExpedition', JSON.stringify(formData));
    sessionStorage.setItem('estimationExpedition', JSON.stringify(this.estimation));

    const clientId = this.authService.getUserId();
    if (!clientId) {
      this.router.navigate(['/connexion']);
      return;
    }

    // On ne crée pas l'expédition ici. On passe juste à l'étape récapitulatif.
    this.isLoading = false;
    this.router.navigate(['/client/recapitulatif']);
  }
}
