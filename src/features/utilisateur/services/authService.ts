import { apiFetch } from '@/shared/api/client'

export interface AuthResponse {
  token: string
  utilisateurId: string
  magasinId: string
  role: string
}

const MAGASIN_ID = import.meta.env.VITE_MAGASIN_ID as string

export function login(email: string, motDePasse: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/client/login', {
    method: 'POST',
    body: JSON.stringify({ magasinId: MAGASIN_ID, email, motDePasse })
  })
}

export function register(email: string, telephone: string, motDePasse: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/client/register', {
    method: 'POST',
    body: JSON.stringify({ magasinId: MAGASIN_ID, email, telephone, motDePasse })
  })
}