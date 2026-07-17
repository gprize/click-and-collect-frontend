<script setup lang="ts">
import { useMagasinStore } from '@/stores/magasin'

const magasinStore = useMagasinStore()
</script>

<template>
  <v-app>
    <v-app-bar v-if="magasinStore.magasin" flat color="surface" density="comfortable">
      <div class="d-flex align-center ml-4" style="gap: 12px;">
        <v-img
          v-if="magasinStore.magasin.logoUrl"
          :src="magasinStore.magasin.logoUrl"
          height="32"
          width="32"
          contain
        />
        <span v-else class="font-weight-bold text-primary" style="font-family: var(--font-display);">
          {{ magasinStore.magasin.nom }}
        </span>

        <span class="text-medium-emphasis" style="font-size: 1.1rem;">×</span>

        <v-img src="/pwa-192x192.png" height="32" width="32" contain />
      </div>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>