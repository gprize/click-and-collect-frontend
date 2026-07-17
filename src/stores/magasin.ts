import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchMagasinById } from '@/features/magasin/services/magasinService'
import type { Magasin } from '@/features/magasin/types'

const MAGASIN_ID = import.meta.env.VITE_MAGASIN_ID as string

export const useMagasinStore = defineStore('magasin', () => {
  const magasin = ref<Magasin | null>(null)
  const chargement = ref(true)
  const erreur = ref<string | null>(null)

  async function charger() {
    chargement.value = true
    erreur.value = null
    try {
      magasin.value = await fetchMagasinById(MAGASIN_ID)
    } catch {
      erreur.value = 'Impossible de charger la configuration du magasin'
    } finally {
      chargement.value = false
    }
  }

  return { magasin, chargement, erreur, charger }
})