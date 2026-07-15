import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AuthResponse } from '@/features/utilisateur/services/authService'

const MAGASIN_ID = import.meta.env.VITE_MAGASIN_ID as string

export const useSessionStore = defineStore('session', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const utilisateurId = ref<string | null>(localStorage.getItem('utilisateurId'))
  const magasinId = MAGASIN_ID

  function definirSession(auth: AuthResponse) {
    token.value = auth.token
    utilisateurId.value = auth.utilisateurId
    localStorage.setItem('token', auth.token)
    localStorage.setItem('utilisateurId', auth.utilisateurId)
  }

  function deconnecter() {
    token.value = null
    utilisateurId.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('utilisateurId')
  }

  const estConnecte = () => token.value !== null

  return { token, utilisateurId, magasinId, definirSession, deconnecter, estConnecte }
})