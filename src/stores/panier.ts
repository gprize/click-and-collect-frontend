import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Produit } from '@/features/produit/types'

export interface LignePanier {
  produitId: string
  nom: string
  prixUnitaire: number
  quantite: number
}

const QUANTITE_MAX_PAR_LIGNE = 20

export const usePanierStore = defineStore('panier', () => {
  const lignes = ref<LignePanier[]>([])

  function ajouter(produit: Produit) {
    const existante = lignes.value.find((l) => l.produitId === produit.id)
    if (existante) {
      if (existante.quantite < QUANTITE_MAX_PAR_LIGNE) {
        existante.quantite++
      }
      return
    }
    lignes.value.push({
      produitId: produit.id,
      nom: produit.nom,
      prixUnitaire: produit.prix,
      quantite: 1
    })
  }

  function augmenter(produitId: string) {
    const ligne = lignes.value.find((l) => l.produitId === produitId)
    if (ligne && ligne.quantite < QUANTITE_MAX_PAR_LIGNE) {
      ligne.quantite++
    }
  }

  function diminuer(produitId: string) {
    const ligne = lignes.value.find((l) => l.produitId === produitId)
    if (!ligne) return
    if (ligne.quantite <= 1) {
      retirer(produitId)
    } else {
      ligne.quantite--
    }
  }

  function retirer(produitId: string) {
    lignes.value = lignes.value.filter((l) => l.produitId !== produitId)
  }

  function viderPanier() {
    lignes.value = []
  }

  function quantitePourProduit(produitId: string): number {
    return lignes.value.find((l) => l.produitId === produitId)?.quantite ?? 0
  }

  const total = computed(() =>
    lignes.value.reduce((sum, l) => sum + l.prixUnitaire * l.quantite, 0)
  )

  const nombreArticles = computed(() =>
    lignes.value.reduce((sum, l) => sum + l.quantite, 0)
  )

  return {
    lignes,
    ajouter,
    augmenter,
    diminuer,
    retirer,
    viderPanier,
    quantitePourProduit,
    total,
    nombreArticles,
    QUANTITE_MAX_PAR_LIGNE
  }
})