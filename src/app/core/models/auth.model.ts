export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface AuthResponse {
  token: string;
  role: string;
  nomComplet: string;
  userId: number;
}

export interface RegisterRequest {
  nomComplet: string;
  email: string;
  telephone: string;
  motDePasse: string;
  role: string;
}
