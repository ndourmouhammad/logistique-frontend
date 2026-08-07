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