export interface ProfilResponse {
  id: number;
  nomComplet: string;
  email: string;
  telephone: string;
  role: string;
}

export interface ProfilUpdateRequest {
  nomComplet?: string;
  telephone?: string;
}
