import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpeditionRequest, ExpeditionResponse, EstimationResponse, EstimationRequest, TrackingResponse } from '../models/expedition.model';

@Injectable({ providedIn: 'root' })
export class ExpeditionService {

  private apiUrl = environment.apiUrl;

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

  initierPaiement(expeditionId: number): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/paiement/initier`,
    { expeditionId }
  );
}
}