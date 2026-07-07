import { apiFetch } from '@/shared/api/client'

export interface UtilisateurRequest {
  email: string
  telephone: string
  motDePasse: string
}

export interface UtilisateurResponse {
  id: string
  email: string
  telephone: string
}

export function creerUtilisateur(email: string, telephone: string): Promise<UtilisateurResponse> {
  // Mot de passe généré automatiquement : pas d'auth pour ce test, juste une identification légère
  const motDePasseGenere = crypto.randomUUID()

  return apiFetch<UtilisateurResponse>('/utilisateurs', {
    method: 'POST',
    body: JSON.stringify({ email, telephone, motDePasse: motDePasseGenere })
  })
}

export function fetchUtilisateurParEmail(email: string): Promise<UtilisateurResponse> {
  return apiFetch<UtilisateurResponse>(`/utilisateurs?email=${encodeURIComponent(email)}`)
}