import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { ExpeditionService } from '../../../core/services/expedition';
import { Auth } from '../../../core/services/auth';
import { EstimationResponse, ExpeditionFormData, EstimationRequest } from '../../../core/models/expedition.model';
import { debounceTime, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-expedition',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ClientLayout],
  templateUrl: './expedition.html',
  styleUrl: './expedition.scss',
})
export class Expedition implements OnInit {
  expeditionForm!: FormGroup;

  // Estimation depuis le backend — signal (règle 9 : Subject RxJS conservé, résultat stocké en signal)
  estimation = signal<EstimationResponse>({
    fraisTransport: 1500,
    fraisRamassage: 0,
    fraisAssurance: 0,
    total:          1500
  });

  isLoading    = signal(false);
  isEstimating = signal(false);
  erreurMessage = signal('');

  villes = ['Dakar', 'Thiès', 'Diourbel', 'Touba', 'Bambey', 'Mbacke Baol'];

  // Subject pour le debounce (conservé tel quel — règle 9)
  private estimationTrigger$ = new Subject<void>();

  private expeditionService = inject(ExpeditionService);
  private authService = inject(Auth);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  ngOnInit() {
    this.expeditionForm = this.fb.group({
      adresseDepart:      ['', Validators.required],
      quartierDepart:     [''],
      villeDepart:        ['Dakar', Validators.required],
      nomExpediteur:      [''],
      telExpediteur:      [''],
      nomDestinataire:    ['', Validators.required],
      telDestinataire:    ['', Validators.required],
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
      methodePaiement:    ['WAVE']
    });

    // Restaurer le formulaire s'il existe dans le sessionStorage
    const savedForm = sessionStorage.getItem('formulaireExpedition');
    if (savedForm) {
      try {
        const data: ExpeditionFormData = JSON.parse(savedForm);
        this.expeditionForm.patchValue(data);
      } catch (e) {
        console.error('Erreur lors de la restauration du formulaire', e);
      }
    }

    // Abonnement aux changements pour l'estimation
    this.expeditionForm.valueChanges.subscribe(() => {
      this.onOptionsChange();
    });

    // Appel API avec debounce 400ms — Subject conservé, résultat stocké en signal
    this.estimationTrigger$
      .pipe(
        debounceTime(400),
        switchMap(() => {
          this.isEstimating.set(true);
          const formValue = this.expeditionForm.value;
          const payload: EstimationRequest = {
            poids:          formValue.poids          || 0,
            volume:         formValue.volume         || 0,
            estExpress:     formValue.estExpress,
            avecRamassage:  formValue.avecRamassage,
            assurance:      formValue.assurance,
            valeurDeclaree: formValue.valeurDeclaree || 0,
          };
          return this.expeditionService.estimerTarif(payload);
        })
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

    // Charger l'estimation initiale au chargement
    this.onOptionsChange();
  }

  // Déclencher l'estimation à chaque changement
  onOptionsChange() {
    this.estimationTrigger$.next();
  }

  soumettre() {
    if (this.expeditionForm.invalid) {
      this.erreurMessage.set('Veuillez remplir tous les champs obligatoires.');
      this.expeditionForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.erreurMessage.set('');

    const formData: ExpeditionFormData = this.expeditionForm.value;

    sessionStorage.setItem('formulaireExpedition', JSON.stringify(formData));
    sessionStorage.setItem('estimationExpedition', JSON.stringify(this.estimation()));

    const clientId = this.authService.getUserId();
    if (!clientId) {
      this.router.navigate(['/connexion']);
      return;
    }

    // On ne crée pas l'expédition ici. On passe juste à l'étape récapitulatif.
    this.isLoading.set(false);
    this.router.navigate(['/client/recapitulatif']);
  }
}
