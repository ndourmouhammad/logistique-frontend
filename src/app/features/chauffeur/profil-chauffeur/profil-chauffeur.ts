import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChauffeurLayout } from '../../../shared/components/chauffeur-layout/chauffeur-layout';
import { Auth } from '../../../core/services/auth';
import { ProfilService } from '../../../core/services/profil';

@Component({
  selector: 'app-profil-chauffeur',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ChauffeurLayout],
  templateUrl: './profil-chauffeur.html',
  styleUrl: './profil-chauffeur.scss',
})
export class ProfilChauffeur implements OnInit {

  nomComplet    = signal('');
  initiales     = signal('');
  email         = signal('');
  telephone     = signal('');
  showConfirm   = signal(false);
  isEditing     = signal(false);
  isLoading     = signal(false);
  successMsg    = signal('');
  errorMsg      = signal('');

  profilForm!: FormGroup;

  private authService = inject(Auth);
  private profilService = inject(ProfilService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  ngOnInit() {
    this.initForm();
    this.loadProfil();
  }

  initForm() {
    this.profilForm = this.fb.group({
      nomComplet: ['', Validators.required],
      telephone: ['', Validators.required]
    });
  }

  loadProfil() {
    const nom = this.authService.getNomComplet() || '';
    this.updateHeader(nom);

    this.profilService.getProfil().subscribe({
      next: (profil) => {
        this.email.set(profil.email || '');
        this.telephone.set(profil.telephone || '');
        this.profilForm.patchValue({
          nomComplet: profil.nomComplet,
          telephone: profil.telephone
        });
        this.updateHeader(profil.nomComplet);
      },
      error: (err) => console.error('Erreur chargement profil', err)
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
    if (this.profilForm.invalid) return;
    this.isLoading.set(true);
    this.successMsg.set('');
    this.errorMsg.set('');

    this.profilService.updateProfil(this.profilForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isEditing.set(false);
        this.successMsg.set('Profil mis à jour avec succès');
        this.telephone.set(this.profilForm.value.telephone);
        this.updateHeader(this.profilForm.value.nomComplet);
        localStorage.setItem('nomComplet', this.profilForm.value.nomComplet);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMsg.set(err.error || 'Erreur lors de la mise à jour');
      }
    });
  }

  demanderConfirmation()  { this.showConfirm.set(true);  }
  annulerDeconnexion()    { this.showConfirm.set(false); }
  confirmerDeconnexion()  { this.authService.logout();   }
}