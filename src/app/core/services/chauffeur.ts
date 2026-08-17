import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpeditionListItem, FeuilleRouteResponse, TourneeHistoriqueResponse } from '../models/relais.model';

@Injectable({ providedIn: 'root' })
export class ChauffeurService {
  private apiUrl = `${environment.apiUrl}/chauffeur`;

  constructor(private http: HttpClient) {}

  // ── Liste des expéditions affectées à ce chauffeur ───────────────────────
  getMesExpeditions(chauffeurId: number): Observable<ExpeditionListItem[]> {
    return this.http.get<ExpeditionListItem[]>(
      `${this.apiUrl}/mes-expeditions?chauffeurId=${chauffeurId}`,
    );
  }

  // ── Déclencher le départ inter-hub ────────────────────────────────────────
  partirInterHub(expeditionId: number, chauffeurId: number, lieuDepart: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/expeditions/${expeditionId}/depart?chauffeurId=${chauffeurId}&lieuDepart=${encodeURIComponent(lieuDepart)}`,
      {},
    );
  }

  // Ajoutez cette méthode dans ChauffeurService
  // getMesExpeditionsEnTransit(chauffeurId: number): Observable<ExpeditionListItem[]> {
  //   return this.http.get<ExpeditionListItem[]>(
  //     `${this.apiUrl}/mes-expeditions-transit?chauffeurId=${chauffeurId}`,
  //   );
  // }

  // Ajoutez aussi cette méthode pour la réception au hub de destination
  // (réutilise l'endpoint Hub existant)
  recevoirAuHub(expeditionId: number, hubId: number): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/hub/expeditions/${expeditionId}/reception?hubId=${hubId}`,
      {},
    );
  }

  // Ajoutez ces méthodes dans ChauffeurService

getMesExpeditionsEnTransit(chauffeurId: number): Observable<ExpeditionListItem[]> {
  return this.http.get<ExpeditionListItem[]>(
    `${this.apiUrl}/mes-expeditions-transit?chauffeurId=${chauffeurId}`
  );
}

confirmerArrivee(chauffeurId: number): Observable<ExpeditionListItem[]> {
  return this.http.post<ExpeditionListItem[]>(
    `${this.apiUrl}/confirmer-arrivee?chauffeurId=${chauffeurId}`, {}
  );
}

getFeuilleRoute(chauffeurId: number): Observable<FeuilleRouteResponse> {
  return this.http.get<FeuilleRouteResponse>(
    `${this.apiUrl}/feuille-route?chauffeurId=${chauffeurId}`
  );
}

getHistoriqueTournees(chauffeurId: number): Observable<TourneeHistoriqueResponse[]> {
  return this.http.get<TourneeHistoriqueResponse[]>(
    `${this.apiUrl}/historique-tournees?chauffeurId=${chauffeurId}`
  );
}

}
