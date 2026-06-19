import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpeditionListItem } from '../models/relais.model';

@Injectable({ providedIn: 'root' })
export class LivreurService {

  private apiUrl = 'http://localhost:8080/api/livreur';
  private http = inject(HttpClient);

  getMesLivraisons(livreurId: number): Observable<ExpeditionListItem[]> {
    return this.http.get<ExpeditionListItem[]>(
      `${this.apiUrl}/mes-livraisons?livreurId=${livreurId}`
    );
  }

  validerLivraison(expeditionId: number, otpSaisi: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/expeditions/${expeditionId}/livrer?otpSaisi=${otpSaisi}`, {}
    );
  }
}