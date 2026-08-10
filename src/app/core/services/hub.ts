import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChauffeurResponse, DispatchChauffeurRequest, ExpeditionResponse, LivreurResponse, ExpeditionGuichetRequest } from '../models/expedition.model';
import { DispatchRequest, ExpeditionListItem } from '../models/relais.model';
import { HubResponse } from '../models/hub.model';



@Injectable({ providedIn: 'root' })
export class HubService {
  private apiUrl = `${environment.apiUrl}/hub`;

  constructor(private http: HttpClient) {}

  // ── Réception d'un colis ─────────────────────────────────────────────────
  recevoirColis(expeditionId: number, hubId: number): Observable<ExpeditionResponse> {
    return this.http.put<ExpeditionResponse>(
      `${this.apiUrl}/expeditions/${expeditionId}/reception?hubId=${hubId}`,
      {},
    );
  }

  // ── Colis attendus (en cours de ramassage, pas encore reçus) ─────────────
  getColisAttendus(hubId: number): Observable<ExpeditionListItem[]> {
    return this.http.get<ExpeditionListItem[]>(`${this.apiUrl}/${hubId}/colis-attendus`);
  }

  // ── Expéditions reçues, pas encore affectées à un livreur ───────────────
  getExpeditionsATrier(hubId: number): Observable<ExpeditionListItem[]> {
    return this.http.get<ExpeditionListItem[]>(`${this.apiUrl}/${hubId}/expeditions-a-trier`);
  }

  // ── Affecter un livreur à un lot d'expéditions ───────────────────────────
  dispatcher(request: DispatchRequest): Observable<ExpeditionResponse[]> {
    return this.http.post<ExpeditionResponse[]>(`${this.apiUrl}/expeditions/dispatch`, request);
  }

  // ── Remise directe au guichet (retrait client au hub) ───────────────────
  remiseGuichet(expeditionId: number, otpSaisi: string): Observable<ExpeditionResponse> {
    return this.http.post<ExpeditionResponse>(
      `${this.apiUrl}/expeditions/${expeditionId}/remise-guichet?otpSaisi=${otpSaisi}`,
      {},
    );
  }

  // ── Création d'expédition au guichet ──────────────────────────────────────
  enregistrerExpeditionGuichet(request: ExpeditionGuichetRequest): Observable<ExpeditionResponse> {
    return this.http.post<ExpeditionResponse>(`${this.apiUrl}/expeditions/guichet`, request);
  }

  getLivreursDisponibles(zone: string): Observable<LivreurResponse[]> {
    return this.http.get<LivreurResponse[]>(
      `${environment.apiUrl}/livreur/disponibles?zone=${zone}`,
    );
  }

  getChauffeursDisponibles(): Observable<ChauffeurResponse[]> {
  return this.http.get<ChauffeurResponse[]>(
    `${this.apiUrl}/chauffeurs/disponibles`
  );
}

dispatcherChauffeur(request: DispatchChauffeurRequest): Observable<ExpeditionResponse[]> {
  return this.http.post<ExpeditionResponse[]>(
    `${this.apiUrl}/expeditions/dispatch-chauffeur`, request
  );
}

getMonHub(gestionnaireId: number): Observable<HubResponse> {
  return this.http.get<HubResponse>(
    `${this.apiUrl}/mon-hub?gestionnaireId=${gestionnaireId}`
  );
}

// Liste tous les hubs — endpoint accessible au GESTIONNAIRE_HUB
getTousLesHubs(): Observable<HubResponse[]> {
  return this.http.get<HubResponse[]>(`${this.apiUrl}/tous-les-hubs`);
}

deposerAuRelais(expeditionId: number, pointRelaisId: number, forcerSubstitution: boolean = false): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/expeditions/${expeditionId}/depot-relais?pointRelaisId=${pointRelaisId}&forcerSubstitution=${forcerSubstitution}`,
    {}
  );
}

// ── Stock du hub (colis physiquement présents) ─────────────────────────────
getStock(hubId: number): Observable<ExpeditionListItem[]> {
  return this.http.get<ExpeditionListItem[]>(`${this.apiUrl}/${hubId}/stock`);
}
}
