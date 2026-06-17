export interface ExpeditionListItem {
  id:                number;
  codeTracking:      string;
  nomDestinataire:   string;
  villeDestinataire: string;
  statut:            string;
  poids:             number;
  fraisLivraison:    number;
}

export interface CommissionResponse {
  id:                      number;
  montant:                 number;
  dateCalcul:              string;
  estPayee:                boolean;
  dateVersement:           string | null;
  codeTrackingExpedition:  string;
}