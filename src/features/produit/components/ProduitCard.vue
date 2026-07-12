<script setup lang="ts">
import type { Produit } from '../types'

defineProps<{ produit: Produit }>()
const emit = defineEmits<{ ajouter: [produit: Produit] }>()
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
        color="primary"
        variant="flat"
        block
        :disabled="!produit.disponible"
        @click="emit('ajouter', produit)"
      >
        Ajouter au panier
      </v-btn>
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