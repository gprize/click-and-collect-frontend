<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchMagasins } from '../services/magasinService'
import { useSessionStore } from '@/stores/session'
import type { Magasin } from '../types'

const magasins = ref<Magasin[]>([])
const chargement = ref(true)
const erreur = ref<string | null>(null)

const router = useRouter()
const session = useSessionStore()

onMounted(async () => {
  try {
    magasins.value = await fetchMagasins()
  } catch {
    erreur.value = 'Impossible de charger la liste des magasins'
  } finally {
    chargement.value = false
  }
})

function choisir(magasin: Magasin) {
  session.selectionnerMagasin(magasin.id)
  router.push({ name: 'produits', params: { magasinId: magasin.id } })
}
</script>

<template>
  <v-container class="py-8">
    <h1 class="text-h5 mb-6">Choisissez votre magasin</h1>

    <v-progress-circular v-if="chargement" indeterminate color="primary" />
    <v-alert v-else-if="erreur" type="error" :text="erreur" />

    <v-row v-else>
      <v-col v-for="magasin in magasins" :key="magasin.id" cols="12" sm="6" md="4">
        <v-card hover @click="choisir(magasin)">
          <v-card-title>{{ magasin.nom }}</v-card-title>
          <v-card-subtitle>{{ magasin.adresse }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>