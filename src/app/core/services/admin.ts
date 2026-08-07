import { environment } from '../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminStats, UtilisateurAdmin, CreateEmployeRequest, HubAdmin, HubRequest, RelaisAdmin, RelaisRequest, VehiculeAdmin, VehiculeRequest } from '../models/admin.model';

@Injectable({
  providedIn: 'root',
})

export class AdminService {

  private apiUrl = `${environment.apiUrl}/admin`;
  private http   = inject(HttpClient);

  // ── Stats ─────────────────────────────────────────────────────────────────
  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/stats`);
  }

  // ── Utilisateurs ──────────────────────────────────────────────────────────
  getUtilisateurs(): Observable<UtilisateurAdmin[]> {
    return this.http.get<UtilisateurAdmin[]>(`${this.apiUrl}/utilisateurs`);
  }

  creerEmploye(request: CreateEmployeRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/employes`, request, { responseType: 'text' });
  }

  toggleStatut(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/utilisateurs/${id}/toggle-statut`, {}, { responseType: 'text' });
  }

  // ── Hubs ──────────────────────────────────────────────────────────────────
  getHubs(): Observable<HubAdmin[]> {
    return this.http.get<HubAdmin[]>(`${this.apiUrl}/hubs`);
  }

  creerHub(request: HubRequest): Observable<HubAdmin> {
    return this.http.post<HubAdmin>(`${this.apiUrl}/hubs`, request);
  }

  modifierHub(id: number, request: HubRequest): Observable<HubAdmin> {
    return this.http.put<HubAdmin>(`${this.apiUrl}/hubs/${id}`, request);
  }

  // ── Relais ────────────────────────────────────────────────────────────────
  getRelais(): Observable<RelaisAdmin[]> {
    return this.http.get<RelaisAdmin[]>(`${this.apiUrl}/relais`);
  }

  creerRelais(request: RelaisRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/relais`, request, { responseType: 'text' });
  }

  modifierRelais(id: number, request: RelaisRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/relais/${id}`, request, { responseType: 'text' });
  }

  // ── Véhicules ─────────────────────────────────────────────────────────────
  getVehicules(): Observable<VehiculeAdmin[]> {
    return this.http.get<VehiculeAdmin[]>(`${this.apiUrl}/vehicules`);
  }

  creerVehicule(request: VehiculeRequest): Observable<VehiculeAdmin> {
    return this.http.post<VehiculeAdmin>(`${this.apiUrl}/vehicules`, request);
  }

  modifierVehicule(id: number, request: VehiculeRequest): Observable<VehiculeAdmin> {
    return this.http.put<VehiculeAdmin>(`${this.apiUrl}/vehicules/${id}`, request);
  }

  assignerChauffeur(vehiculeId: number, chauffeurId: number): Observable<VehiculeAdmin> {
    return this.http.put<VehiculeAdmin>(
      `${this.apiUrl}/vehicules/${vehiculeId}/assigner-chauffeur/${chauffeurId}`,
      {}
    );
  }
}
