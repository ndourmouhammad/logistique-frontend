export interface ExpeditionListItem {
  id:                number;
  codeTracking:      string;
  nomDestinataire:   string;
  villeDestinataire: string;
  statut:            string;
  poids:             number;
  fraisLivraison:    number;
  modeLivraison:     'RETRAIT_HUB' | 'RETRAIT_RELAIS' | 'LIVRAISON_DOMICILE';
  villePointRelais:  string | null;
  dateReception:     string | null;
}

export interface DispatchRequest {
  expeditionIds: number[];
  livreurId: number;
}

export interface CommissionResponse {
  id:                      number;
  montant:                 number;
  dateCalcul:              string;
  estPayee:                boolean;
  dateVersement:           string | null;
  codeTrackingExpedition:  string;
}

export interface LivreurStats {
  coursesLivrees: number;
  gainsTotal:     number;
  tauxReussite:   number;
}

export interface PointRelaisListItem {
    id:               number;
    nomEnseigne:      string;
    ville:            string;
    capaciteMaxColis: number;
    stockActuel:      number;
    rue?:             string;
}

export interface PointRelaisContext {
  id:          number;
  nomEnseigne: string;
  ville:       string;
}

export interface FeuilleRouteResponse {
  trajetJour: TrajetJourFeuilleRoute;
  kpis: KpisFeuilleRoute;
  etapes: EtapeFeuilleRoute[];
}

export interface TrajetJourFeuilleRoute {
  depart: string;
  arrivee: string;
  heure: string;
}

export interface KpisFeuilleRoute {
  hubs: number;
  colis: number;
  duree: string;
}

export interface EtapeFeuilleRoute {
  num: number;
  nom: string;
  action: string;
  heure: string;
  detail: string;
  statut: 'DONE' | 'ACTIVE' | 'PENDING';
}