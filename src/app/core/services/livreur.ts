import { environment } from '../../../environments/environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpeditionListItem, LivreurStats } from '../models/relais.model';

@Injectable({ providedIn: 'root' })
export class LivreurService {

  private apiUrl = `${environment.apiUrl}/livreur`;
  private http = inject(HttpClient);

  getMesLivraisons(livreurId: number): Observable<ExpeditionListItem[]> {
    return this.http.get<ExpeditionListItem[]>(
      `${this.apiUrl}/mes-livraisons?livreurId=${livreurId}`
    );
  }

  getStats(livreurId: number): Observable<LivreurStats> {
    return this.http.get<LivreurStats>(
      `${this.apiUrl}/stats?livreurId=${livreurId}`
    );
  }

  validerLivraison(expeditionId: number, otpSaisi: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/expeditions/${expeditionId}/livrer?otpSaisi=${otpSaisi}`, {}
    );
  }

  getExpeditionsACollecter(livreurId: number): Observable<ExpeditionListItem[]> {
  return this.http.get<ExpeditionListItem[]>(
    `${this.apiUrl}/a-collecter?livreurId=${livreurId}`
  );
}

collecterExpedition(expeditionId: number, livreurId: number): Observable<any> {
  return this.http.put(
    `${this.apiUrl}/expeditions/${expeditionId}/collecte?livreurId=${livreurId}`,
    {}
  );
}

getHistorique(livreurId: number): Observable<any[]> {
  return this.http.get<any[]>(
    `${this.apiUrl}/historique?livreurId=${livreurId}`
  );
}

}