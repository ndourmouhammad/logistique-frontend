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

// Chauffeur
{ path: 'chauffeur/feuille-route', loadComponent: () => import('./features/chauffeur/feuille-route/feuille-route').then(m => m.FeuilleRoute) },
{ path: 'chauffeur/scan-lot', loadComponent: () => import('./features/chauffeur/scan-lot/scan-lot').then(m => m.ScanLot) },
{ path: 'chauffeur/trajet', loadComponent: () => import('./features/chauffeur/trajet-chauffeur/trajet-chauffeur').then(m => m.TrajetChauffeur) },
{ path: 'chauffeur/validation-transfert', loadComponent: () => import('./features/chauffeur/validation-transfert/validation-transfert').then(m => m.ValidationTransfert) },
{ path: 'chauffeur/historique-tournees', loadComponent: () => import('./features/chauffeur/historique-tournees/historique-tournees').then(m => m.HistoriqueTournees) },

// Hub
{ path: 'hub/dashboard', loadComponent: () => import('./features/hub/dashboard-hub/dashboard-hub').then(m => m.DashboardHub) },
{ path: 'hub/reception', loadComponent: () => import('./features/hub/reception-colis/reception-colis').then(m => m.ReceptionColis) },
{ path: 'hub/plan', loadComponent: () => import('./features/hub/plan-hub/plan-hub').then(m => m.PlanHub) },
{ path: 'hub/tri', loadComponent: () => import('./features/hub/tri-selection/tri-selection').then(m => m.TriSelection) },
{ path: 'hub/preparation', loadComponent: () => import('./features/hub/preparation-expedition/preparation-expedition').then(m => m.PreparationExpedition) },
{ path: 'hub/validation-depart', loadComponent: () => import('./features/hub/validation-depart/validation-depart').then(m => m.ValidationDepart) },
{ path: 'hub/remise-guichet', loadComponent: () => import('./features/hub/remise-guichet/remise-guichet').then(m => m.RemiseGuichet) },

// Admin
{ path: 'admin/dashboard', loadComponent: () => import('./features/admin/dashboard-admin/dashboard-admin').then(m => m.DashboardAdmin) },
{ path: 'admin/utilisateurs', loadComponent: () => import('./features/admin/utilisateurs/utilisateurs').then(m => m.Utilisateurs) },
{ path: 'admin/flotte', loadComponent: () => import('./features/admin/flotte/flotte').then(m => m.Flotte) },
{ path: 'admin/dispatch-litiges', loadComponent: () => import('./features/admin/dispatch-litiges/dispatch-litiges').then(m => m.DispatchLitiges) },
{ path: 'admin/incidents', loadComponent: () => import('./features/admin/incidents/incidents').then(m => m.Incidents) },
{ path: 'admin/rapports', loadComponent: () => import('./features/admin/rapports/rapports').then(m => m.Rapports) },
{ path: 'admin/parametres', loadComponent: () => import('./features/admin/parametres/parametres').then(m => m.Parametres) },

// Point Relais
{ path: 'relais/dashboard', loadComponent: () => import('./features/relais/dashboard-relais/dashboard-relais').then(m => m.DashboardRelais) },
{ path: 'relais/reception', loadComponent: () => import('./features/relais/reception-relais/reception-relais').then(m => m.ReceptionRelais) },
{ path: 'relais/stock', loadComponent: () => import('./features/relais/stock-relais/stock-relais').then(m => m.StockRelais) },
{ path: 'relais/remise', loadComponent: () => import('./features/relais/remise-relais/remise-relais').then(m => m.RemiseRelais) },
{ path: 'relais/commissions', loadComponent: () => import('./features/relais/commissions-relais/commissions-relais').then(m => m.CommissionsRelais) },

  { path: '**', redirectTo: 'accueil' }
];