import { apiFetch } from '@/shared/api/client'
import type { CommandeRequest, CommandeResponse } from '../types'

export function creerCommande(request: CommandeRequest): Promise<CommandeResponse> {
  return apiFetch<CommandeResponse>('/commandes', {
    method: 'POST',
    body: JSON.stringify(request)
  })
}

// TODO temporaire : à remplacer par le vrai flux de paiement MTN MoMo / Orange Money.
// Simule la confirmation de paiement en appelant directement l'endpoint de test du backend.
export function simulerPaiement(commandeId: string): Promise<CommandeResponse> {
  return apiFetch<CommandeResponse>(`/commandes/${commandeId}/marquer-payee`, {
    method: 'PATCH'
  })
}

export function fetchCommandesMagasin(magasinId: string): Promise<CommandeResponse[]> {
  return apiFetch<CommandeResponse[]>(`/commandes?magasinId=${magasinId}`)
}

export function demarrerPreparation(commandeId: string): Promise<CommandeResponse> {
  return apiFetch<CommandeResponse>(`/commandes/${commandeId}/demarrer-preparation`, {
    method: 'PATCH'
  })
}

export function marquerPrete(commandeId: string): Promise<CommandeResponse> {
  return apiFetch<CommandeResponse>(`/commandes/${commandeId}/marquer-prete`, {
    method: 'PATCH'
  })
}

export function validerRecuperation(magasinId: string, codeRetrait: string): Promise<CommandeResponse> {
  return apiFetch<CommandeResponse>('/commandes/recuperation', {
    method: 'POST',
    body: JSON.stringify({ magasinId, codeRetrait })
  })
}