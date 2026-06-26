export interface AdminStats {
  totalExpeditions:   number;
  expeditionsLivrees: number;
  totalUtilisateurs:  number;
  totalClients:       number;
  totalLivreurs:      number;
  totalChauffeurs:    number;
  totalHubs:          number;
  totalRelais:        number;
  totalVehicules:     number;
  tauxLivraison:      number;
}

export interface UtilisateurAdmin {
  id:               number;
  nomComplet:       string;
  email:            string;
  telephone:        string;
  role:             string;
  actif:            boolean;
  premierConnexion: boolean;
  zoneAction:       string | null;
  numeroPermis:     string | null;
  hubNom:           string | null;
  relaisNom:        string | null;
}

export interface CreateEmployeRequest {
  nomComplet:    string;
  email:         string;
  telephone:     string;
  role:          string;
  zoneAction?:   string;
  numeroPermis?: string;
  hubId?:        number;
  relaisId?:     number;
}

export interface HubAdmin {
  id:   number;
  nom:  string;
  ville: string;
}

export interface HubRequest {
  nom:              string;
  capaciteStockage: number;
  rue:              string;
  ville:            string;
  region:           string;
}

export interface RelaisAdmin {
  id:              number;
  nomEnseigne:     string;
  ville:           string;
  capaciteMaxColis: number;
  stockActuel:     number;
}

export interface RelaisRequest {
  nomEnseigne:            string;
  capaciteMaxColis:       number;
  tauxCommissionParColis: number;
  rue:                    string;
  ville:                  string;
  region:                 string;
}

export interface VehiculeAdmin {
  id:               number;
  immatriculation:  string;
  type:             string;
  capaciteMaxPoids: number;
  capaciteMaxVolume: number;
  statut:           string;
  chauffeurId:      number | null;
  chauffeurNom:     string | null;
}

export interface VehiculeRequest {
  immatriculation:  string;
  type:             string;
  capaciteMaxPoids: number;
  capaciteMaxVolume: number;
  statut:           string;
  chauffeurId?:     number;
}