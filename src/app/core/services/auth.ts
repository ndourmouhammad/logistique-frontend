import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest, AuthResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class Auth {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // Inscription
  register(request: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, request, {
      responseType: 'text'
    });
  }

  // Connexion
  login(credentials: LoginRequest): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
    .pipe(
      tap((response: AuthResponse) => {
        localStorage.setItem('token',            response.token);
        localStorage.setItem('role',             response.role);
        localStorage.setItem('nomComplet',       response.nomComplet);
        localStorage.setItem('premierConnexion', response.premierConnexion ? 'true' : 'false');
        const uid = response.userId;
        if (uid) localStorage.setItem('userId', uid.toString());
      })
    );
}

// Ajoutez ce getter
isPremierConnexion(): boolean {
  return localStorage.getItem('premierConnexion') === 'true';
}

// Ajoutez ces deux méthodes
changerMotDePasse(utilisateurId: number, ancienMotDePasse: string, nouveauMotDePasse: string): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/auth/changer-mot-de-passe`,
    { utilisateurId: utilisateurId.toString(), ancienMotDePasse, nouveauMotDePasse },
    { responseType: 'text' }
  );
}

changerMotDePassePremierConnexion(utilisateurId: number, nouveauMotDePasse: string): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/auth/premier-connexion`,
    { utilisateurId: utilisateurId.toString(), nouveauMotDePasse },
    { responseType: 'text' }
  );
}

  // Déconnexion
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/connexion']);
  }

  // Getters
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getNomComplet(): string | null {
    return localStorage.getItem('nomComplet');
  }

  getUserId(): number | null {
    const id = localStorage.getItem('userId');
    return id ? parseInt(id) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Redirection selon le rôle
  redirectByRole(): void {
  // ── Si premier connexion → forcer le changement de mot de passe ──────────
  if (this.isPremierConnexion()) {
    this.router.navigate(['/changer-mot-de-passe']);
    return;
  }

  const role = this.getRole();
  const routes: Record<string, string> = {
    'ROLE_CLIENT':           '/client/dashboard',
    'ROLE_LIVREUR':          '/livreur/dashboard',
    'ROLE_CHAUFFEUR':        '/chauffeur/feuille-route',
    'ROLE_GESTIONNAIRE_HUB': '/hub/dashboard',
    'ROLE_ADMIN':            '/admin/dashboard',
    'ROLE_GERANT_RELAIS':    '/relais/dashboard',
  };
  this.router.navigate([routes[role ?? ''] ?? '/connexion']);
}

  // Ajoutez ces deux méthodes
demanderReinitialisationMotDePasse(email: string): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/auth/mot-de-passe-oublie`,
    { email },
    { responseType: 'text' }
  );
}

reinitialiserMotDePasse(token: string, nouveauMotDePasse: string): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/auth/reinitialiser-mot-de-passe`,
    { token, nouveauMotDePasse },
    { responseType: 'text' }
  );
}
}