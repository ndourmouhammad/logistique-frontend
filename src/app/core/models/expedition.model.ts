export interface ExpeditionRequest {
  clientId:             number;
  nomDestinataire:      string;
  telephoneDestinataire:string;
  adresseDepart:        string;
  villeDepart?:         string;
  rue:                  string;
  ville:                string;
  region:               string;
  codePostal:           string;
  pays:                 string;
  descriptionContenu:   string;
  poids:                number;
  volume?:              number;
  estExpress:           boolean;
  avecRamassage?:       boolean;
  assurance?:           boolean;
  valeurDeclaree?:      number;
  methodePaiement:      string;
}

export interface ExpeditionResponse {
  id:                    number;
  codeTracking:          string;
  statut:                string;
  nomDestinataire:       string;
  telephoneDestinataire: string;
  villeDestinataire:     string;
  adresseDepart:         string;
  poids:                 number;
  estExpress:            boolean;
  fraisLivraison:        number;
  otpLivraison:          string;
  dateCreation:          string;
}

export interface EstimationResponse {
  fraisTransport: number;
  fraisRamassage: number;
  fraisAssurance: number;
  total:          number;
}

// Interface for the frontend Reactive Form
export interface ExpeditionFormData {
  adresseDepart: string;
  quartierDepart: string;
  villeDepart: string;
  nomExpediteur: string;
  telExpediteur: string;
  nomDestinataire: string;
  telDestinataire: string;
  rue: string;
  quartierArrivee: string;
  ville: string;
  region: string;
  codePostal: string;
  pays: string;
  descriptionContenu: string;
  poids: number;
  volume: number;
  estExpress: boolean;
  avecRamassage: boolean;
  assurance: boolean;
  valeurDeclaree: number;
  methodePaiement: string;
}

export interface EstimationRequest {
  poids:          number;
  volume:         number;
  estExpress:     boolean;
  avecRamassage:  boolean;
  assurance:      boolean;
  valeurDeclaree: number;
}

export interface TrackingResponse {
  codeTracking:   string;
  statutGlobal:   string;
  nomDestinataire:string;
  villeArrivee:   string;
  fraisLivraison: number;
  etapes: {
    statutEnregistre: string;
    dateHeure:        string;
    localisation:     string;
    commentaire:      string;
  }[];
}
