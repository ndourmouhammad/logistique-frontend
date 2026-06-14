import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpeditionService } from '../../../core/services/expedition';
import { Auth } from '../../../core/services/auth';
import { EstimationResponse, ExpeditionFormData } from '../../../core/models/expedition.model';
import { debounceTime, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-expedition',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './expedition.html',
  styleUrl: './expedition.scss',
})
export class Expedition implements OnInit {
  expeditionForm!: FormGroup;

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

    // Appel API avec debounce 400ms
    this.estimationTrigger$
      .pipe(
        debounceTime(400),
        switchMap(() => {
          this.isEstimating = true;
          const formValue = this.expeditionForm.value;
          return this.expeditionService.estimerTarif({
            poids:          formValue.poids          || 0,
            volume:         formValue.volume         || 0,
            estExpress:     formValue.estExpress,
            avecRamassage:  formValue.avecRamassage,
            assurance:      formValue.assurance,
            valeurDeclaree: formValue.valeurDeclaree || 0,
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
    if (this.expeditionForm.invalid) {
      this.erreurMessage = 'Veuillez remplir tous les champs obligatoires.';
      this.expeditionForm.markAllAsTouched();
      return;
    }

    this.isLoading     = true;
    this.erreurMessage = '';

    const formData: ExpeditionFormData = this.expeditionForm.value;
    
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
