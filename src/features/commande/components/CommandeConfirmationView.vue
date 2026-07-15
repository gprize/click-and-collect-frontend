<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { apiFetch } from '@/shared/api/client'
import type { CommandeResponse } from '../types'

const route = useRoute()

const commande = ref<CommandeResponse | null>(null)
const chargement = ref(true)
const erreur = ref<string | null>(null)

onMounted(async () => {
  const commandeId = route.params.commandeId as string
  try {
    commande.value = await apiFetch<CommandeResponse>(`/commandes/${commandeId}`)
  } catch {
    erreur.value = 'Une erreur est survenue'
  } finally {
    chargement.value = false
  }
})
</script>

<template>
  <v-container class="py-8 text-center" style="max-width: 420px">
    <v-progress-circular v-if="chargement" indeterminate color="primary" />

    <v-alert v-else-if="erreur" type="error" :text="erreur" />

    <template v-else-if="commande">
      <v-icon icon="mdi-check-circle" color="primary" size="56" class="mb-4" />
      <h1 class="text-h5 mb-2">Commande confirmée</h1>
      <p class="text-body-2 mb-8" style="color: var(--color-muted)">
        Présentez ce ticket en magasin pour récupérer vos courses
      </p>

      <div class="ticket mb-6">
        <div class="ticket-eyebrow mb-2">Code de retrait</div>
        <div class="ticket-code text-h3 text-primary mb-4">{{ commande.codeRetrait }}</div>
        <v-divider class="mb-4" style="border-style: dashed; opacity: 0.4" />
        <div class="prix text-h6">{{ commande.total.toLocaleString('fr-FR') }} FCFA</div>
        <div class="ticket-eyebrow mt-1">Total payé</div>
      </div>

      <v-btn variant="tonal" color="primary" :to="{ name: 'produits' }">
        Retour au catalogue
      </v-btn>
    </template>
  </v-container>
</template>