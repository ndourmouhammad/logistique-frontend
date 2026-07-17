import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientLayout } from '../../../shared/components/client-layout/client-layout';
import { Auth } from '../../../core/services/auth';
import { ClientService } from '../../../core/services/client';

@Component({
  selector: 'app-profil-client',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ClientLayout],
  templateUrl: './profil-client.html',
  styleUrl: './profil-client.scss',
})
export class ProfilClient implements OnInit {

  nomComplet  = signal('');
  initiales   = signal('');
  showConfirm = signal(false);
  isEditing   = signal(false);
  isLoading   = signal(false);
  successMsg  = signal('');
  errorMsg    = signal('');
  email       = signal('');

  profilForm!: FormGroup;

  private authService = inject(Auth);
  private clientService = inject(ClientService);
  private fb = inject(FormBuilder);

  ngOnInit() {
    this.initForm();
    this.loadProfil();
  }

  initForm() {
    this.profilForm = this.fb.group({
      nomComplet: ['', Validators.required],
      telephone: ['', Validators.required],
      typeClient: ['B2C', Validators.required],
      rue: [''],
      ville: [''],
      region: [''],
      codePostal: ['']
    });
  }

  loadProfil() {
    const nom = this.authService.getNomComplet() || '';
    this.updateHeader(nom);

    this.clientService.getProfil().subscribe({
      next: (profil) => {
        this.email.set(profil.email || '');
        this.profilForm.patchValue({
          nomComplet: profil.nomComplet,
          telephone: profil.telephone,
          typeClient: profil.typeClient || 'B2C',
          rue: profil.rue || profil.adressePrincipale?.rue || '',
          ville: profil.ville || profil.adressePrincipale?.ville || '',
          region: profil.region || profil.adressePrincipale?.region || '',
          codePostal: profil.codePostal || profil.adressePrincipale?.codePostal || ''
        });
        this.updateHeader(profil.nomComplet);
      },
      error: (err) => {
        console.error('Erreur chargement profil', err);
      }
    });
  }

  updateHeader(nom: string) {
    this.nomComplet.set(nom);
    if (nom) {
      this.initiales.set(
        nom.trim().split(/\s+/)
          .map(n => n.charAt(0))
          .join('')
          .substring(0, 2)
          .toUpperCase()
      );
    }
  }

  toggleEdit() {
    this.isEditing.set(!this.isEditing());
    this.successMsg.set('');
    this.errorMsg.set('');
  }

  onSubmit() {
    if (this.profilForm.invalid) {
      this.profilForm.markAllAsTouched();
      this.errorMsg.set('Veuillez remplir correctement les champs obligatoires.');
      return;
    }

    this.isLoading.set(true);
    this.successMsg.set('');
    this.errorMsg.set('');

    this.clientService.updateProfil(this.profilForm.value).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.isEditing.set(false);
        this.successMsg.set('Profil mis à jour avec succès');
        this.updateHeader(this.profilForm.value.nomComplet);
        localStorage.setItem('nomComplet', this.profilForm.value.nomComplet);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMsg.set('Erreur lors de la mise à jour du profil');
        console.error(err);
      }
    });
  }

  demanderConfirmation() { this.showConfirm.set(true);  }
  annulerDeconnexion()   { this.showConfirm.set(false); }
  confirmerDeconnexion() { this.authService.logout();   }
}