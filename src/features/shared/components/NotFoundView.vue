<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function retourAccueil() {
  router.push({ name: 'selection-magasin' })
}
</script>

<template>
  <v-container class="py-16 text-center" style="max-width: 420px">
    <div class="ticket mb-6">
      <div class="ticket-eyebrow mb-2">Erreur 404</div>
      <div class="ticket-code text-h2 text-primary mb-2">🛒💨</div>
      <p class="text-body-2" style="color: var(--color-muted)">
        La page que vous cherchez n'existe pas ou plus.
      </p>
    </div>

    <v-btn color="primary" variant="flat" size="large" @click="retourAccueil">
      Retour aux magasins
    </v-btn>
  </v-container>
</template>