<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { fetchProduitsByMagasin } from '../services/produitService'
import { fetchMagasinById } from '@/features/magasin/services/magasinService'
import { usePanierStore } from '@/stores/panier'
import { useSessionStore } from '@/stores/session'
import ProduitCard from './ProduitCard.vue'
import type { Produit } from '../types'
import type { Magasin } from '@/features/magasin/types'

const panier = usePanierStore()
const session = useSessionStore()

const produits = ref<Produit[]>([])
const magasin = ref<Magasin | null>(null)
const chargement = ref(true)
const erreur = ref<string | null>(null)
const recherche = ref('')

let debounceTimer: ReturnType<typeof setTimeout> | undefined

async function chargerProduits(terme?: string) {
  try {
    produits.value = await fetchProduitsByMagasin(session.magasinId, terme)
  } catch {
    erreur.value = 'Impossible de charger le catalogue'
  }
}

async function chargerTout() {
  chargement.value = true
  erreur.value = null
  try {
    const [produitsData, magasinData] = await Promise.all([
      fetchProduitsByMagasin(session.magasinId),
      fetchMagasinById(session.magasinId)
    ])
    produits.value = produitsData
    magasin.value = magasinData
  } catch {
    erreur.value = 'Impossible de charger le catalogue'
  } finally {
    chargement.value = false
  }
}

onMounted(chargerTout)

watch(recherche, (terme) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => chargerProduits(terme), 300)
})
</script>

<template>
  <v-container class="py-8">
    <div class="d-flex justify-space-between align-center" style="gap: 16px;">
      <h1 class="text-h5" style="margin: 0;">{{ magasin?.nom ?? '...' }}</h1>
      <v-btn variant="tonal" color="primary" prepend-icon="mdi-cart" :to="{ name: 'panier' }">
        Panier ({{ panier.nombreArticles }})
      </v-btn>
    </div>

    <p v-if="magasin" class="text-body-2 mt-1 mb-6" style="color: var(--color-muted)">
      <v-icon icon="mdi-map-marker-outline" size="16" class="mr-1" />{{ magasin.adresse }}
    </p>

    <v-text-field
      v-model="recherche"
      placeholder="Rechercher un produit..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      density="comfortable"
      clearable
      class="mb-6"
      hide-details
    />

    <v-progress-circular v-if="chargement" indeterminate color="primary" />
    <v-alert v-else-if="erreur" type="error" :text="erreur" />

    <template v-else>
      <v-row v-if="produits.length > 0">
        <v-col v-for="produit in produits" :key="produit.id" cols="12" sm="6" md="4">
          <ProduitCard :produit="produit" @ajouter="panier.ajouter" />
        </v-col>
      </v-row>

      <p v-else class="text-body-2 text-center mt-8" style="color: var(--color-muted)">
        Aucun produit ne correspond à "{{ recherche }}"
      </p>
    </template>
  </v-container>
</template>