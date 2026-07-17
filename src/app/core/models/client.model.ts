export interface ClientProfilRequest {
  nomComplet: string;
  telephone: string;
  typeClient: 'B2C' | 'B2B';
  rue: string;
  ville: string;
  region: string;
  codePostal: string;
}

export interface ClientProfilResponse {
  id: number;
  nomComplet: string;
  email: string;
  telephone: string;
  typeClient: 'B2C' | 'B2B';
  rue?: string;
  ville?: string;
  region?: string;
  codePostal?: string;
  adressePrincipale?: {
    rue?: string;
    ville?: string;
    region?: string;
    codePostal?: string;
  };
}
