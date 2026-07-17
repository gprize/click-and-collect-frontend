<script setup lang="ts">
import { computed } from 'vue'
import { usePanierStore } from '@/stores/panier'
import type { Produit } from '../types'

const props = defineProps<{ produit: Produit }>()
const panier = usePanierStore()

const quantite = computed(() => panier.quantitePourProduit(props.produit.id))
</script>

<template>
  <v-card variant="flat" class="produit-card" border>
    <v-card-item>
      <v-card-title class="text-subtitle-1">{{ produit.nom }}</v-card-title>
    </v-card-item>

    <v-card-text>
      <div class="prix text-h6 text-primary mb-2">
        {{ produit.prix.toLocaleString('fr-FR') }} <span class="text-body-2">FCFA</span>
      </div>

      <v-chip
        :color="produit.disponible ? 'market-amber' : 'error'"
        variant="flat"
        size="small"
        density="comfortable"
      >
        {{ produit.disponible ? 'Disponible' : 'Rupture de stock' }}
      </v-chip>
    </v-card-text>

    <v-card-actions>
      <v-btn
        v-if="quantite === 0"
        color="primary"
        variant="flat"
        block
        :disabled="!produit.disponible"
        @click="panier.ajouter(produit)"
      >
        Ajouter au panier
      </v-btn>

      <div v-else class="d-flex align-center justify-center" style="width: 100%; gap: 8px;">
        <v-btn icon="mdi-minus" size="small" variant="tonal" color="primary" @click="panier.diminuer(produit.id)" />
        <span class="text-h6" style="min-width: 24px; text-align: center;">{{ quantite }}</span>
        <v-btn
          icon="mdi-plus"
          size="small"
          variant="tonal"
          color="primary"
          :disabled="quantite >= panier.QUANTITE_MAX_PAR_LIGNE"
          @click="panier.augmenter(produit.id)"
        />
      </div>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.produit-card {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.produit-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(33, 38, 31, 0.08);
}
</style>