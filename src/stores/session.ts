import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSessionStore = defineStore('session', () => {
  const magasinId = ref<string | null>(localStorage.getItem('magasinId'))
  const utilisateurId = ref<string | null>(localStorage.getItem('utilisateurId'))

  function selectionnerMagasin(id: string) {
    magasinId.value = id
  }

  function identifierUtilisateur(id: string) {
    utilisateurId.value = id
  }

  watch(magasinId, (value) => {
    if (value) localStorage.setItem('magasinId', value)
    else localStorage.removeItem('magasinId')
  })

  watch(utilisateurId, (value) => {
    if (value) localStorage.setItem('utilisateurId', value)
    else localStorage.removeItem('utilisateurId')
  })

  return { magasinId, utilisateurId, selectionnerMagasin, identifierUtilisateur }
})