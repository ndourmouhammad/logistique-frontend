import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpeditionResponse } from '../models/expedition.model';
import { CommissionResponse, PointRelaisListItem } from '../models/relais.model';
import { ExpeditionListItem } from './hub';



@Injectable({ providedIn: 'root' })
export class RelaisService {

  private apiUrl = 'http://localhost:8080/api/relais';

  constructor(private http: HttpClient) {}

  // ── Dépôt au Point Relais ─────────────────────────────────────────────────
  deposerColis(expeditionId: number, pointRelaisId: number): Observable<ExpeditionResponse> {
    return this.http.put<ExpeditionResponse>(
      `${this.apiUrl}/expeditions/${expeditionId}/depot?pointRelaisId=${pointRelaisId}`, {}
    );
  }

  // ── Remise au client ─────────────────────────────────────────────────────
  remettreAuClient(expeditionId: number, otpSaisi: string): Observable<ExpeditionResponse> {
    return this.http.post<ExpeditionResponse>(
      `${this.apiUrl}/expeditions/${expeditionId}/remettre?otpSaisi=${otpSaisi}`, {}
    );
  }

  // ── Colis attendus (en transit, pas encore arrivés) ─────────────────────
  getColisAttendus(relaisId: number): Observable<ExpeditionListItem[]> {
    return this.http.get<ExpeditionListItem[]>(
      `${this.apiUrl}/${relaisId}/colis-attendus`
    );
  }

  // ── Stock (colis arrivés, en attente de retrait) ────────────────────────
  getStock(relaisId: number): Observable<ExpeditionListItem[]> {
    return this.http.get<ExpeditionListItem[]>(
      `${this.apiUrl}/${relaisId}/stock`
    );
  }

  // ── Commissions ───────────────────────────────────────────────────────────
  getCommissions(relaisId: number): Observable<CommissionResponse[]> {
    return this.http.get<CommissionResponse[]>(
      `${this.apiUrl}/${relaisId}/commissions`
    );
  }

  // ── Points relais par ville ───────────────────────────────────────────────────────────

getPointsRelaisParVille(ville: string): Observable<PointRelaisListItem[]> {
  return this.http.get<PointRelaisListItem[]>(
    `${this.apiUrl}/par-ville?ville=${encodeURIComponent(ville)}`
  );
}
}