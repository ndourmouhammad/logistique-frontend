import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProfilResponse, ProfilUpdateRequest } from '../models/profil.model';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {
  private apiUrl = environment.apiUrl + '/profil';

  constructor(private http: HttpClient) {}

  getProfil(): Observable<ProfilResponse> {
    return this.http.get<ProfilResponse>(`${this.apiUrl}/me`);
  }

  updateProfil(request: ProfilUpdateRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/me`, request, { responseType: 'text' });
  }
}
