import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },

  // Auth
  { path: 'onboarding', loadComponent: () => import('./features/auth/onboarding/onboarding').then(m => m.Onboarding) },
  { path: 'connexion', loadComponent: () => import('./features/auth/connexion/connexion').then(m => m.Connexion) },
  { path: 'inscription', loadComponent: () => import('./features/auth/inscription/inscription').then(m => m.Inscription) },
  { path: 'mot-de-passe-oublie', loadComponent: () => import('./features/auth/mot-de-passe-oublie/mot-de-passe-oublie').then(m => m.MotDePasseOublie) },

  // Client
  { path: 'accueil', loadComponent: () => import('./features/client/accueil/accueil').then(m => m.Accueil) },
  { path: 'client/dashboard', loadComponent: () => import('./features/client/dashboard/dashboard').then(m => m.Dashboard) },
  { path: 'client/expedition', loadComponent: () => import('./features/client/expedition/expedition').then(m => m.Expedition) },
  { path: 'client/recapitulatif', loadComponent: () => import('./features/client/recapitulatif/recapitulatif').then(m => m.Recapitulatif) },
  { path: 'client/paiement', loadComponent: () => import('./features/client/paiement/paiement').then(m => m.Paiement) },
  { path: 'client/confirmation', loadComponent: () => import('./features/client/confirmation/confirmation').then(m => m.Confirmation) },
  { path: 'client/tracking', loadComponent: () => import('./features/client/tracking/tracking').then(m => m.Tracking) },
  { path: 'client/historique', loadComponent: () => import('./features/client/historique/historique').then(m => m.Historique) },
  { path: 'client/validation-otp', loadComponent: () => import('./features/client/validation-otp/validation-otp').then(m => m.ValidationOtp) },

  // Livreur
{ path: 'livreur/dashboard', loadComponent: () => import('./features/livreur/dashboard-livreur/dashboard-livreur').then(m => m.DashboardLivreur) },
{ path: 'livreur/nouvelle-course', loadComponent: () => import('./features/livreur/nouvelle-course/nouvelle-course').then(m => m.NouvelleCourse) },
{ path: 'livreur/scan', loadComponent: () => import('./features/livreur/scan-enlevement/scan-enlevement').then(m => m.ScanEnlevement) },
{ path: 'livreur/depot-hub', loadComponent: () => import('./features/livreur/depot-hub/depot-hub').then(m => m.DepotHub) },
{ path: 'livreur/itineraire', loadComponent: () => import('./features/livreur/itineraire-client/itineraire-client').then(m => m.ItineraireClient) },
{ path: 'livreur/validation-livraison', loadComponent: () => import('./features/livreur/validation-livraison/validation-livraison').then(m => m.ValidationLivraison) },
{ path: 'livreur/echec-livraison', loadComponent: () => import('./features/livreur/echec-livraison/echec-livraison').then(m => m.EchecLivraison) },
{ path: 'livreur/historique-gains', loadComponent: () => import('./features/livreur/historique-gains/historique-gains').then(m => m.HistoriqueGains) },

  { path: '**', redirectTo: 'accueil' }
];