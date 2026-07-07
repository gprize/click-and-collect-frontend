import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Produit } from '@/features/produit/types'

export interface LignePanier {
  produitId: string
  nom: string
  prixUnitaire: number
  quantite: number
  stockDisponible: number
}

export const usePanierStore = defineStore('panier', () => {
  const lignes = ref<LignePanier[]>([])

  function ajouter(produit: Produit) {
    const existante = lignes.value.find((l) => l.produitId === produit.id)
    if (existante) {
      if (existante.quantite < produit.quantiteStock) {
        existante.quantite++
      }
      return
    }
    lignes.value.push({
      produitId: produit.id,
      nom: produit.nom,
      prixUnitaire: produit.prix,
      quantite: 1,
      stockDisponible: produit.quantiteStock
    })
  }

  function retirer(produitId: string) {
    lignes.value = lignes.value.filter((l) => l.produitId !== produitId)
  }

  function viderPanier() {
    lignes.value = []
  }

  const total = computed(() =>
    lignes.value.reduce((sum, l) => sum + l.prixUnitaire * l.quantite, 0)
  )

  const nombreArticles = computed(() =>
    lignes.value.reduce((sum, l) => sum + l.quantite, 0)
  )

  return { lignes, ajouter, retirer, viderPanier, total, nombreArticles }
})