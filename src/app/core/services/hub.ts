import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpeditionResponse, LivreurResponse } from '../models/expedition.model';


export interface ExpeditionListItem {
  id:                number;
  codeTracking:      string;
  nomDestinataire:   string;
  villeDestinataire: string;
  statut:            string;
  poids:             number;
  fraisLivraison:    number;
}

export interface DispatchRequest {
  expeditionIds: number[];
  livreurId:     number;
}

@Injectable({ providedIn: 'root' })
export class HubService {

  private apiUrl = 'http://localhost:8080/api/hub';

  constructor(private http: HttpClient) {}

  // ── Réception d'un colis ─────────────────────────────────────────────────
  recevoirColis(expeditionId: number, hubId: number): Observable<ExpeditionResponse> {
    return this.http.put<ExpeditionResponse>(
      `${this.apiUrl}/expeditions/${expeditionId}/reception?hubId=${hubId}`, {}
    );
  }

  // ── Colis attendus (en cours de ramassage, pas encore reçus) ─────────────
  getColisAttendus(hubId: number): Observable<ExpeditionListItem[]> {
    return this.http.get<ExpeditionListItem[]>(
      `${this.apiUrl}/${hubId}/colis-attendus`
    );
  }

  // ── Expéditions reçues, pas encore affectées à un livreur ───────────────
  getExpeditionsATrier(hubId: number): Observable<ExpeditionListItem[]> {
    return this.http.get<ExpeditionListItem[]>(
      `${this.apiUrl}/${hubId}/expeditions-a-trier`
    );
  }

  // ── Affecter un livreur à un lot d'expéditions ───────────────────────────
  dispatcher(request: DispatchRequest): Observable<ExpeditionResponse[]> {
    return this.http.post<ExpeditionResponse[]>(
      `${this.apiUrl}/expeditions/dispatch`, request
    );
  }

  // ── Remise directe au guichet (retrait client au hub) ───────────────────
  remiseGuichet(expeditionId: number, otpSaisi: string): Observable<ExpeditionResponse> {
    return this.http.post<ExpeditionResponse>(
      `${this.apiUrl}/expeditions/${expeditionId}/remise-guichet?otpSaisi=${otpSaisi}`, {}
    );
  }

  getLivreursDisponibles(zone: string): Observable<LivreurResponse[]> {
  return this.http.get<LivreurResponse[]>(
   `http://localhost:8080/api/livreur/disponibles?zone=${zone}`
  );
}
}