import { Component, inject, OnInit, signal, computed, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { ExpeditionService } from '../../../core/services/expedition';
import { RelaisService} from '../../../core/services/relais';
import { Auth } from '../../../core/services/auth';
import { ClientService } from '../../../core/services/client';
import { EstimationResponse, ExpeditionFormData, EstimationRequest, ModeLivraison } from '../../../core/models/expedition.model';
import { debounceTime, Subject, switchMap } from 'rxjs';
import { PointRelaisListItem } from '../../../core/models/relais.model';

@Component({
  selector: 'app-expedition',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ClientLayout],
  templateUrl: './expedition.html',
  styleUrl: './expedition.scss',
})
export class Expedition implements OnInit {
  expeditionForm!: FormGroup;

  estimation = signal<EstimationResponse>({
    fraisTransport: 1500,
    fraisRamassage: 0,
    fraisAssurance: 0,
    total:          1500
  });

  isLoading    = signal(false);
  isEstimating = signal(false);
  erreurMessage = signal('');
  erreurTelephone = signal('');
  erreurEmail = signal('');
  emailExpediteur = signal('');

  villes = ['Dakar', 'Thiès', 'Diourbel', 'Touba', 'Bambey', 'Mbacke'];

  // ── AJOUT : points relais disponibles pour la ville de destination ───────
  pointsRelaisDisponibles = signal<PointRelaisListItem[]>([]);
  isLoadingPointsRelais    = signal(false);

  private estimationTrigger$ = new Subject<void>();

  private expeditionService = inject(ExpeditionService);
  private relaisService = inject(RelaisService);
  private authService = inject(Auth);
  private clientService = inject(ClientService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.expeditionForm = this.fb.group({
      adresseDepart:      ['', Validators.required],
      quartierDepart:     [''],
      villeDepart:        ['Dakar', Validators.required],
      nomExpediteur:      [''],
      telExpediteur:      [''],
      nomDestinataire:    ['', Validators.required],
      telDestinataire:    ['', Validators.required],
      emailDestinataire:  ['', [Validators.required, Validators.email]],
      rue:                [''],
      quartierArrivee:    [''],
      ville:              ['Thiès', Validators.required],
      region:             [''],
      codePostal:         [''],
      pays:               ['Sénégal', Validators.required],
      descriptionContenu: [''],
      poids:              [0, [Validators.required, Validators.min(0.1)]],
      volume:             [0],
      estExpress:         [false],
      avecRamassage:      [false],
      assurance:          [false],
      valeurDeclaree:     [0],
      methodePaiement:    ['WAVE'],
      // ── AJOUT ──────────────────────────────────────────────────────────
      modeLivraison:            ['RETRAIT_HUB', Validators.required],
      pointRelaisDestinationId: [null]
    });

    const savedForm = sessionStorage.getItem('formulaireExpedition');
    if (savedForm) {
      try {
        const data: ExpeditionFormData = JSON.parse(savedForm);
        this.expeditionForm.patchValue(data);
      } catch (e) {
        console.error('Erreur lors de la restauration du formulaire', e);
      }
    }

    // ── AJOUT : Préremplir avec le profil client s'il y a des infos vides ──
    this.clientService.getProfil().subscribe({
      next: (profil) => {
        const currentForm = this.expeditionForm.getRawValue();
        const rue = profil.rue || profil.adressePrincipale?.rue || '';
        this.emailExpediteur.set(profil.email || '');
        this.expeditionForm.patchValue({
          nomExpediteur: currentForm.nomExpediteur || profil.nomComplet,
          telExpediteur: currentForm.telExpediteur || profil.telephone,
          adresseDepart: currentForm.adresseDepart || rue,
        }, { emitEvent: false }); // On évite de déclencher l'estimation inutilement ici
      }
    });

    this.expeditionForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.onOptionsChange();
    });

    // ── AJOUT : recharger les points relais quand la ville ou le mode change ─
    this.expeditionForm.get('ville')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.expeditionForm.get('modeLivraison')?.value === 'RETRAIT_RELAIS') {
        this.chargerPointsRelais();
      }
    });

    this.expeditionForm.get('modeLivraison')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((mode: ModeLivraison) => {
      if (mode === 'RETRAIT_RELAIS') {
        this.chargerPointsRelais();
      } else {
        this.expeditionForm.patchValue({ pointRelaisDestinationId: null }, { emitEvent: false });
      }
    });

    this.estimationTrigger$
      .pipe(
        debounceTime(400),
        switchMap(() => {
          this.isEstimating.set(true);
          const formValue = this.expeditionForm.getRawValue();
          const payload: EstimationRequest = {
            poids:          formValue.poids          || 0,
            volume:         formValue.volume         || 0,
            estExpress:     formValue.estExpress,
            avecRamassage:  formValue.avecRamassage,
            assurance:      formValue.assurance,
            valeurDeclaree: formValue.valeurDeclaree || 0,
            modeLivraison:  formValue.modeLivraison,        // ← AJOUT
          };
          return this.expeditionService.estimerTarif(payload);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (data) => {
          this.estimation.set(data);
          this.isEstimating.set(false);
        },
        error: () => {
          this.isEstimating.set(false);
        }
      });

    this.onOptionsChange();

    // Charger les points relais si le formulaire restauré est déjà sur RETRAIT_RELAIS
    if (this.expeditionForm.get('modeLivraison')?.value === 'RETRAIT_RELAIS') {
      this.chargerPointsRelais();
    }


  }

  // ── AJOUT : charger les points relais selon la ville sélectionnée ────────
  chargerPointsRelais() {
    const ville = this.expeditionForm.get('ville')?.value;
    if (!ville) return;

    this.isLoadingPointsRelais.set(true);
    this.relaisService.getPointsRelaisParVille(ville).subscribe({
      next: (data) => {
        this.isLoadingPointsRelais.set(false);
        this.pointsRelaisDisponibles.set(data);
      },
      error: () => {
        this.isLoadingPointsRelais.set(false);
        this.pointsRelaisDisponibles.set([]);
      }
    });
  }

  onOptionsChange() {
    this.estimationTrigger$.next();
  }

  soumettre() {
    if (this.expeditionForm.invalid) {
      this.erreurMessage.set('Veuillez remplir tous les champs obligatoires.');
      this.expeditionForm.markAllAsTouched();
      return;
    }

    // ── AJOUT : validation cohérente côté frontend aussi ─────────────────
    const mode = this.expeditionForm.get('modeLivraison')?.value;
    const pointRelaisId = this.expeditionForm.get('pointRelaisDestinationId')?.value;
    if (mode === 'RETRAIT_RELAIS' && !pointRelaisId) {
      this.erreurMessage.set('Veuillez sélectionner un point relais.');
      return;
    }

    this.isLoading.set(true);
    this.erreurMessage.set('');
    this.erreurTelephone.set('');
    this.erreurEmail.set('');

    const formData: ExpeditionFormData = this.expeditionForm.getRawValue();

    let hasIdenticalError = false;

    // ── AJOUT : empêcher le même email / téléphone ─────────────────────────
    if (formData.telExpediteur && formData.telDestinataire && formData.telExpediteur.trim() === formData.telDestinataire.trim()) {
      this.erreurTelephone.set("Le numéro de téléphone du destinataire ne peut pas être identique à celui de l'expéditeur.");
      hasIdenticalError = true;
    }
    
    if (this.emailExpediteur() && formData.emailDestinataire && this.emailExpediteur().trim().toLowerCase() === formData.emailDestinataire.trim().toLowerCase()) {
      this.erreurEmail.set("L'adresse email du destinataire ne peut pas être la vôtre.");
      hasIdenticalError = true;
    }

    if (hasIdenticalError) {
      this.isLoading.set(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    sessionStorage.setItem('formulaireExpedition', JSON.stringify(formData));
    sessionStorage.setItem('estimationExpedition', JSON.stringify(this.estimation()));

    const clientId = this.authService.getUserId();
    if (!clientId) {
      this.router.navigate(['/connexion']);
      return;
    }

    this.isLoading.set(false);
    this.router.navigate(['/client/recapitulatif']);
  }
}