import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EstimationRequest {
  poids:          number;
  volume:         number;
  estExpress:     boolean;
  avecRamassage:  boolean;
  assurance:      boolean;
  valeurDeclaree: number;
}

export interface EstimationResponse {
  fraisTransport: number;
  fraisRamassage: number;
  fraisAssurance: number;
  total:          number;
}

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
  id:                   number;
  codeTracking:         string;
  otpLivraison:         string;
  statut:               string;
  fraisLivraison:       number;
  nomDestinataire:      string;
  telephoneDestinataire:string;
  villeDestinataire:    string;
  adresseDepart:        string;
  poids:                number;
  estExpress:           boolean;
  dateCreation:         string;
  descriptionContenu?:  string;
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

@Injectable({ providedIn: 'root' })
export class ExpeditionService {

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Créer une expédition 
  creerExpedition(request: ExpeditionRequest): Observable<ExpeditionResponse> {
    return this.http.post<ExpeditionResponse>(
      `${this.apiUrl}/expeditions`, request
    );
  }

  // Tracker une expédition 
  trackerExpedition(codeTracking: string): Observable<TrackingResponse> {
    return this.http.get<TrackingResponse>(
      `${this.apiUrl}/expeditions/tracking/${codeTracking}`
    );
  }

  // Historique client 
  getHistoriqueClient(clientId: number): Observable<ExpeditionResponse[]> {
    return this.http.get<ExpeditionResponse[]>(
      `${this.apiUrl}/expeditions/client/${clientId}`
    );
  }

  estimerTarif(request: EstimationRequest): Observable<EstimationResponse> {
    return this.http.post<EstimationResponse>(
      `${this.apiUrl}/estimations`, request
    );
  }
}