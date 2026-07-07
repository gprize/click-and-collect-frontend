import { apiFetch } from '@/shared/api/client'
import type { Magasin } from '../types'

export function fetchMagasins(): Promise<Magasin[]> {
  return apiFetch<Magasin[]>('/magasins')
}

export function fetchMagasinById(id: string): Promise<Magasin> {
  return apiFetch<Magasin>(`/magasins/${id}`)
}