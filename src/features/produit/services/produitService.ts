import { apiFetch } from '@/shared/api/client'
import type { Produit } from '../types'

export function fetchProduitsByMagasin(magasinId: string): Promise<Produit[]> {
  return apiFetch<Produit[]>(`/produits?magasinId=${magasinId}`)
}