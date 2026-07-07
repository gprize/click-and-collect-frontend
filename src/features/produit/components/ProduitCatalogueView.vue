<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchProduitsByMagasin } from '../services/produitService'
import { fetchMagasinById } from '@/features/magasin/services/magasinService'
import { usePanierStore } from '@/stores/panier'
import ProduitCard from './ProduitCard.vue'
import type { Produit } from '../types'
import type { Magasin } from '@/features/magasin/types'

const route = useRoute()
const panier = usePanierStore()

const produits = ref<Produit[]>([])
const magasin = ref<Magasin | null>(null)
const chargement = ref(true)
const erreur = ref<string | null>(null)

async function charger(magasinId: string) {
  chargement.value = true
  erreur.value = null
  try {
    const [produitsData, magasinData] = await Promise.all([
      fetchProduitsByMagasin(magasinId),
      fetchMagasinById(magasinId)
    ])
    produits.value = produitsData
    magasin.value = magasinData
  } catch {
    erreur.value = 'Impossible de charger le catalogue'
  } finally {
    chargement.value = false
  }
}

onMounted(() => charger(route.params.magasinId as string))
watch(() => route.params.magasinId, (id) => charger(id as string))
</script>

<template>
  <v-container class="py-8">
    <div class="d-flex justify-space-between align-center mb-0">
      <h1 class="text-h5" style="margin: 0;">{{ magasin?.nom ?? '...' }}</h1>
      <v-btn
        variant="tonal"
        color="primary"
        prepend-icon="mdi-cart"
        :to="{ name: 'panier', params: { magasinId: route.params.magasinId } }"
      >
        Panier ({{ panier.nombreArticles }})
      </v-btn>
    </div>

    <p v-if="magasin" class="text-body-2 mt-1 mb-6" style="color: var(--color-muted)">
      <v-icon icon="mdi-map-marker-outline" size="16" class="mr-1" />{{ magasin.adresse }}
    </p>

    <v-progress-circular v-if="chargement" indeterminate color="primary" />
    <v-alert v-else-if="erreur" type="error" :text="erreur" />

    <v-row v-else>
      <v-col v-for="produit in produits" :key="produit.id" cols="12" sm="6" md="4">
        <ProduitCard :produit="produit" @ajouter="panier.ajouter" />
      </v-col>
    </v-row>
  </v-container>
</template>