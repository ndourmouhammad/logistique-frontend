import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ClientProfilRequest, ClientProfilResponse } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = environment.apiUrl + '/client';

  constructor(private http: HttpClient) {}

  getProfil(): Observable<ClientProfilResponse> {
    return this.http.get<ClientProfilResponse>(`${this.apiUrl}/me`);
  }

  updateProfil(request: ClientProfilRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/profil`, request, { responseType: 'text' });
  }
}
