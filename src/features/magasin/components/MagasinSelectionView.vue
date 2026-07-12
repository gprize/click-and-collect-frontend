<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchMagasins } from '../services/magasinService'
import { useSessionStore } from '@/stores/session'
import type { Magasin } from '../types'

const magasins = ref<Magasin[]>([])
const chargement = ref(true)
const erreur = ref<string | null>(null)
const recherche = ref('')

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

const magasinsFiltres = computed(() => {
  const terme = recherche.value.trim().toLowerCase()
  if (!terme) return magasins.value

  return magasins.value.filter(
    (magasin) =>
      magasin.nom.toLowerCase().includes(terme) || magasin.adresse.toLowerCase().includes(terme)
  )
})

function choisir(magasin: Magasin) {
  session.selectionnerMagasin(magasin.id)
  router.push({ name: 'produits', params: { magasinId: magasin.id } })
}
</script>

<template>
  <v-container class="py-8">
    <h1 class="text-h5 mb-4">Choisissez votre magasin</h1>

    <v-text-field
      v-model="recherche"
      placeholder="Rechercher un magasin, un quartier..."
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
      <v-row v-if="magasinsFiltres.length > 0">
        <v-col v-for="magasin in magasinsFiltres" :key="magasin.id" cols="12" sm="6" md="4">
          <v-card hover @click="choisir(magasin)">
            <v-card-title>{{ magasin.nom }}</v-card-title>
            <v-card-subtitle>{{ magasin.adresse }}</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>

      <p v-else class="text-body-2 text-center mt-8" style="color: var(--color-muted)">
        Aucun magasin ne correspond à "{{ recherche }}"
      </p>
    </template>
  </v-container>
</template>