import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },

  // Routes publiques
  { path: 'accueil',              loadComponent: () => import('./features/client/accueil/accueil').then(m => m.Accueil) },
  { path: 'onboarding',           loadComponent: () => import('./features/auth/onboarding/onboarding').then(m => m.Onboarding) },
  { path: 'connexion',            loadComponent: () => import('./features/auth/connexion/connexion').then(m => m.Connexion) },
  { path: 'inscription',          loadComponent: () => import('./features/auth/inscription/inscription').then(m => m.Inscription) },
  { path: 'mot-de-passe-oublie',  loadComponent: () => import('./features/auth/mot-de-passe-oublie/mot-de-passe-oublie').then(m => m.MotDePasseOublie) },
  { path: 'client/tracking',      loadComponent: () => import('./features/client/tracking/tracking').then(m => m.Tracking) },

  // Client
  { path: 'client/dashboard',     canActivate: [authGuard], data: { roles: ['ROLE_CLIENT'] }, loadComponent: () => import('./features/client/dashboard/dashboard').then(m => m.Dashboard) },
  { path: 'client/expedition',    canActivate: [authGuard], data: { roles: ['ROLE_CLIENT'] }, loadComponent: () => import('./features/client/expedition/expedition').then(m => m.Expedition) },
  { path: 'client/recapitulatif', canActivate: [authGuard], data: { roles: ['ROLE_CLIENT'] }, loadComponent: () => import('./features/client/recapitulatif/recapitulatif').then(m => m.Recapitulatif) },
  { path: 'client/paiement',      canActivate: [authGuard], data: { roles: ['ROLE_CLIENT'] }, loadComponent: () => import('./features/client/paiement/paiement').then(m => m.Paiement) },
  { path: 'client/confirmation',  canActivate: [authGuard], data: { roles: ['ROLE_CLIENT'] }, loadComponent: () => import('./features/client/confirmation/confirmation').then(m => m.Confirmation) },
  { path: 'client/historique',    canActivate: [authGuard], data: { roles: ['ROLE_CLIENT'] }, loadComponent: () => import('./features/client/historique/historique').then(m => m.Historique) },
  { path: 'client/validation-otp',canActivate: [authGuard], data: { roles: ['ROLE_CLIENT'] }, loadComponent: () => import('./features/client/validation-otp/validation-otp').then(m => m.ValidationOtp) },
  { path: 'client/profil',        canActivate: [authGuard], data: { roles: ['ROLE_CLIENT'] }, loadComponent: () => import('./features/client/profil-client/profil-client').then(m => m.ProfilClient) },

  // Livreur
  { path: 'livreur/dashboard',           canActivate: [authGuard], data: { roles: ['ROLE_LIVREUR'] }, loadComponent: () => import('./features/livreur/dashboard-livreur/dashboard-livreur').then(m => m.DashboardLivreur) },
  { path: 'livreur/nouvelle-course',     canActivate: [authGuard], data: { roles: ['ROLE_LIVREUR'] }, loadComponent: () => import('./features/livreur/nouvelle-course/nouvelle-course').then(m => m.NouvelleCourse) },
  { path: 'livreur/scan',                canActivate: [authGuard], data: { roles: ['ROLE_LIVREUR'] }, loadComponent: () => import('./features/livreur/scan-enlevement/scan-enlevement').then(m => m.ScanEnlevement) },
  { path: 'livreur/depot-hub',           canActivate: [authGuard], data: { roles: ['ROLE_LIVREUR'] }, loadComponent: () => import('./features/livreur/depot-hub/depot-hub').then(m => m.DepotHub) },
  { path: 'livreur/itineraire',          canActivate: [authGuard], data: { roles: ['ROLE_LIVREUR'] }, loadComponent: () => import('./features/livreur/itineraire-client/itineraire-client').then(m => m.ItineraireClient) },
  { path: 'livreur/validation-livraison',canActivate: [authGuard], data: { roles: ['ROLE_LIVREUR'] }, loadComponent: () => import('./features/livreur/validation-livraison/validation-livraison').then(m => m.ValidationLivraison) },
  { path: 'livreur/echec-livraison',     canActivate: [authGuard], data: { roles: ['ROLE_LIVREUR'] }, loadComponent: () => import('./features/livreur/echec-livraison/echec-livraison').then(m => m.EchecLivraison) },
  { path: 'livreur/historique-gains',    canActivate: [authGuard], data: { roles: ['ROLE_LIVREUR'] }, loadComponent: () => import('./features/livreur/historique-gains/historique-gains').then(m => m.HistoriqueGains) },
  { path: 'livreur/profil',              canActivate: [authGuard], data: { roles: ['ROLE_LIVREUR'] }, loadComponent: () => import('./features/livreur/profil-livreur/profil-livreur').then(m => m.ProfilLivreur) },

  // Chauffeur
  { path: 'chauffeur/feuille-route',       canActivate: [authGuard], data: { roles: ['ROLE_CHAUFFEUR'] }, loadComponent: () => import('./features/chauffeur/feuille-route/feuille-route').then(m => m.FeuilleRoute) },
  { path: 'chauffeur/scan-lot',            canActivate: [authGuard], data: { roles: ['ROLE_CHAUFFEUR'] }, loadComponent: () => import('./features/chauffeur/scan-lot/scan-lot').then(m => m.ScanLot) },
  { path: 'chauffeur/trajet',              canActivate: [authGuard], data: { roles: ['ROLE_CHAUFFEUR'] }, loadComponent: () => import('./features/chauffeur/trajet-chauffeur/trajet-chauffeur').then(m => m.TrajetChauffeur) },
  { path: 'chauffeur/validation-transfert',canActivate: [authGuard], data: { roles: ['ROLE_CHAUFFEUR'] }, loadComponent: () => import('./features/chauffeur/validation-transfert/validation-transfert').then(m => m.ValidationTransfert) },
  { path: 'chauffeur/historique-tournees', canActivate: [authGuard], data: { roles: ['ROLE_CHAUFFEUR'] }, loadComponent: () => import('./features/chauffeur/historique-tournees/historique-tournees').then(m => m.HistoriqueTournees) },
  { path: 'chauffeur/profil',              canActivate: [authGuard], data: { roles: ['ROLE_CHAUFFEUR'] }, loadComponent: () => import('./features/chauffeur/profil-chauffeur/profil-chauffeur').then(m => m.ProfilChauffeur) },
  // Hub
  { path: 'hub/dashboard',         canActivate: [authGuard], data: { roles: ['ROLE_GESTIONNAIRE_HUB'] }, loadComponent: () => import('./features/hub/dashboard-hub/dashboard-hub').then(m => m.DashboardHub) },
  { path: 'hub/reception',         canActivate: [authGuard], data: { roles: ['ROLE_GESTIONNAIRE_HUB'] }, loadComponent: () => import('./features/hub/reception-colis/reception-colis').then(m => m.ReceptionColis) },
  { path: 'hub/plan',              canActivate: [authGuard], data: { roles: ['ROLE_GESTIONNAIRE_HUB'] }, loadComponent: () => import('./features/hub/plan-hub/plan-hub').then(m => m.PlanHub) },
  { path: 'hub/tri',               canActivate: [authGuard], data: { roles: ['ROLE_GESTIONNAIRE_HUB'] }, loadComponent: () => import('./features/hub/tri-selection/tri-selection').then(m => m.TriSelection) },
  { path: 'hub/depart-chauffeur',  canActivate: [authGuard], data: { roles: ['ROLE_GESTIONNAIRE_HUB'] }, loadComponent: () => import('./features/hub/depart-chauffeur/depart-chauffeur').then(m => m.DepartChauffeur) },
  { path: 'hub/preparation',       canActivate: [authGuard], data: { roles: ['ROLE_GESTIONNAIRE_HUB'] }, loadComponent: () => import('./features/hub/preparation-expedition/preparation-expedition').then(m => m.PreparationExpedition) },
  { path: 'hub/validation-depart', canActivate: [authGuard], data: { roles: ['ROLE_GESTIONNAIRE_HUB'] }, loadComponent: () => import('./features/hub/validation-depart/validation-depart').then(m => m.ValidationDepart) },
  { path: 'hub/remise-guichet',    canActivate: [authGuard], data: { roles: ['ROLE_GESTIONNAIRE_HUB'] }, loadComponent: () => import('./features/hub/remise-guichet/remise-guichet').then(m => m.RemiseGuichet) },
  { path: 'hub/depot-relais',      canActivate: [authGuard], data: { roles: ['ROLE_GESTIONNAIRE_HUB'] }, loadComponent: () => import('./features/hub/depot-relais-hub/depot-relais-hub').then(m => m.DepotRelaisHub) },
  { path: 'hub/profil',              canActivate: [authGuard], data: { roles: ['ROLE_GESTIONNAIRE_HUB'] }, loadComponent: () => import('./features/hub/profil-hub/profil-hub').then(m => m.ProfilHub) },
  // Admin
  { path: 'admin/dashboard',        canActivate: [authGuard], data: { roles: ['ROLE_ADMIN'] }, loadComponent: () => import('./features/admin/dashboard-admin/dashboard-admin').then(m => m.DashboardAdmin) },
  { path: 'admin/utilisateurs',     canActivate: [authGuard], data: { roles: ['ROLE_ADMIN'] }, loadComponent: () => import('./features/admin/utilisateurs/utilisateurs').then(m => m.Utilisateurs) },
  { path: 'admin/flotte',           canActivate: [authGuard], data: { roles: ['ROLE_ADMIN'] }, loadComponent: () => import('./features/admin/flotte/flotte').then(m => m.Flotte) },
  { path: 'admin/dispatch-litiges', canActivate: [authGuard], data: { roles: ['ROLE_ADMIN'] }, loadComponent: () => import('./features/admin/dispatch-litiges/dispatch-litiges').then(m => m.DispatchLitiges) },
  { path: 'admin/incidents',        canActivate: [authGuard], data: { roles: ['ROLE_ADMIN'] }, loadComponent: () => import('./features/admin/incidents/incidents').then(m => m.Incidents) },
  { path: 'admin/rapports',         canActivate: [authGuard], data: { roles: ['ROLE_ADMIN'] }, loadComponent: () => import('./features/admin/rapports/rapports').then(m => m.Rapports) },
  { path: 'admin/parametres',       canActivate: [authGuard], data: { roles: ['ROLE_ADMIN'] }, loadComponent: () => import('./features/admin/parametres/parametres').then(m => m.Parametres) },

  // Point Relais
  { path: 'relais/dashboard',   canActivate: [authGuard], data: { roles: ['ROLE_GERANT_RELAIS'] }, loadComponent: () => import('./features/relais/dashboard-relais/dashboard-relais').then(m => m.DashboardRelais) },
  { path: 'relais/reception',   canActivate: [authGuard], data: { roles: ['ROLE_GERANT_RELAIS'] }, loadComponent: () => import('./features/relais/reception-relais/reception-relais').then(m => m.ReceptionRelais) },
  { path: 'relais/stock',       canActivate: [authGuard], data: { roles: ['ROLE_GERANT_RELAIS'] }, loadComponent: () => import('./features/relais/stock-relais/stock-relais').then(m => m.StockRelais) },
  { path: 'relais/remise',      canActivate: [authGuard], data: { roles: ['ROLE_GERANT_RELAIS'] }, loadComponent: () => import('./features/relais/remise-relais/remise-relais').then(m => m.RemiseRelais) },
  { path: 'relais/commissions', canActivate: [authGuard], data: { roles: ['ROLE_GERANT_RELAIS'] }, loadComponent: () => import('./features/relais/commissions-relais/commissions-relais').then(m => m.CommissionsRelais) },
  { path: 'relais/profil',      canActivate: [authGuard], data: { roles: ['ROLE_GERANT_RELAIS'] }, loadComponent: () => import('./features/relais/profil-relais/profil-relais').then(m => m.ProfilRelais) },

  { path: '**', redirectTo: 'accueil' }
];