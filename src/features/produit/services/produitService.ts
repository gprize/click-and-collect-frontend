import { apiFetch } from '@/shared/api/client'
import type { Produit } from '../types'

export function fetchProduitsByMagasin(magasinId: string, recherche?: string): Promise<Produit[]> {
  const params = new URLSearchParams({ magasinId })
  if (recherche) params.set('recherche', recherche)
  return apiFetch<Produit[]>(`/produits?${params.toString()}`)
}