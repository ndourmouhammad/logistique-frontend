import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'onboarding', pathMatch: 'full' },

  {
    path: 'onboarding',
    loadComponent: () =>
      import('./features/auth/onboarding/onboarding')
        .then(m => m.Onboarding)
  },
  {
    path: 'connexion',
    loadComponent: () =>
      import('./features/auth/connexion/connexion')
        .then(m => m.Connexion)
  },
  {
    path: 'inscription',
    loadComponent: () =>
      import('./features/auth/inscription/inscription')
        .then(m => m.Inscription)
  },
  {
    path: 'mot-de-passe-oublie',
    loadComponent: () =>
      import('./features/auth/mot-de-passe-oublie/mot-de-passe-oublie')
        .then(m => m.MotDePasseOublie)
  },

  { path: '**', redirectTo: 'onboarding' }
];