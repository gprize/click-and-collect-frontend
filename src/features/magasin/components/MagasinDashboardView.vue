<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  fetchCommandesMagasin,
  demarrerPreparation,
  marquerPrete,
  validerRecuperation
} from '@/features/commande/services/commandeService'
import type { CommandeResponse } from '@/features/commande/types'
import { useWebSocketTopic } from '@/shared/composables/useWebSocketTopic'

const route = useRoute()
const magasinId = route.params.magasinId as string

const commandes = ref<CommandeResponse[]>([])
const chargement = ref(true)
const actionEnCours = ref<string | null>(null)
const erreur = ref<string | null>(null)

const codeSaisi = ref('')
const recuperationErreur = ref<string | null>(null)
const recuperationSucces = ref<string | null>(null)

async function charger() {
  chargement.value = true
  try {
    commandes.value = await fetchCommandesMagasin(magasinId)
  } catch {
    erreur.value = 'Impossible de charger les commandes'
  } finally {
    chargement.value = false
  }
}

onMounted(charger)

useWebSocketTopic<CommandeResponse>(`/topic/magasins/${magasinId}/commandes`, (nouvelleCommande) => {
  const index = commandes.value.findIndex((c) => c.id === nouvelleCommande.id)
  if (index >= 0) {
    commandes.value[index] = nouvelleCommande
  } else {
    commandes.value.push(nouvelleCommande)
  }
})

const payees = computed(() => commandes.value.filter((c) => c.statut === 'PAYEE'))
const enPreparation = computed(() => commandes.value.filter((c) => c.statut === 'EN_PREPARATION'))
const pretes = computed(() => commandes.value.filter((c) => c.statut === 'PRETE'))

async function handleDemarrerPreparation(id: string) {
  actionEnCours.value = id
  try {
    await demarrerPreparation(id)
    await charger()
  } catch {
    erreur.value = 'Action impossible, réessayez'
  } finally {
    actionEnCours.value = null
  }
}

async function handleMarquerPrete(id: string) {
  actionEnCours.value = id
  try {
    await marquerPrete(id)
    await charger()
  } catch {
    erreur.value = 'Action impossible, réessayez'
  } finally {
    actionEnCours.value = null
  }
}

async function handleValiderRecuperation() {
  recuperationErreur.value = null
  recuperationSucces.value = null
  try {
    const commande = await validerRecuperation(magasinId, codeSaisi.value.trim().toUpperCase())
    recuperationSucces.value = `Commande ${commande.id.slice(0, 8)}... récupérée avec succès`
    codeSaisi.value = ''
    await charger()
  } catch {
    recuperationErreur.value = 'Code invalide ou commande non prête'
  }
}
</script>

<template>
  <v-container class="py-8">
    <h1 class="text-h5 mb-6">Dashboard magasin</h1>

    <v-card class="mb-8" variant="tonal">
      <v-card-title class="text-subtitle-1">Valider un retrait</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleValiderRecuperation">
          <v-text-field
            v-model="codeSaisi"
            label="Code de retrait client"
            placeholder="Ex. FRX674"
            maxlength="6"
            :error-messages="recuperationErreur ?? undefined"
          />
          <v-alert v-if="recuperationSucces" type="success" :text="recuperationSucces" class="mb-4" />
          <v-btn type="submit" color="primary" variant="flat" :disabled="!codeSaisi">
            Valider le retrait
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <v-progress-circular v-if="chargement" indeterminate color="primary" />
    <v-alert v-else-if="erreur" type="error" :text="erreur" class="mb-4" />

    <v-row v-else>
      <v-col cols="12" md="4">
        <h2 class="text-subtitle-1 mb-3">Payées ({{ payees.length }})</h2>
        <v-card v-for="commande in payees" :key="commande.id" class="mb-3">
          <v-card-text>
            <div class="font-weight-medium">{{ commande.total.toLocaleString('fr-FR') }} FCFA</div>
            <div class="text-caption">{{ commande.lignes.length }} article(s)</div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              size="small"
              color="primary"
              variant="tonal"
              :loading="actionEnCours === commande.id"
              @click="handleDemarrerPreparation(commande.id)"
            >
              Démarrer la préparation
            </v-btn>
          </v-card-actions>
        </v-card>
        <p v-if="payees.length === 0" class="text-medium-emphasis text-body-2">Aucune commande</p>
      </v-col>

      <v-col cols="12" md="4">
        <h2 class="text-subtitle-1 mb-3">En préparation ({{ enPreparation.length }})</h2>
        <v-card v-for="commande in enPreparation" :key="commande.id" class="mb-3">
          <v-card-text>
            <div class="font-weight-medium">{{ commande.total.toLocaleString('fr-FR') }} FCFA</div>
            <div class="text-caption">{{ commande.lignes.length }} article(s)</div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              size="small"
              color="primary"
              variant="tonal"
              :loading="actionEnCours === commande.id"
              @click="handleMarquerPrete(commande.id)"
            >
              Marquer prête
            </v-btn>
          </v-card-actions>
        </v-card>
        <p v-if="enPreparation.length === 0" class="text-medium-emphasis text-body-2">Aucune commande</p>
      </v-col>

      <v-col cols="12" md="4">
        <h2 class="text-subtitle-1 mb-3">Prêtes ({{ pretes.length }})</h2>
        <v-card v-for="commande in pretes" :key="commande.id" class="mb-3">
          <v-card-text>
            <div class="font-weight-medium">{{ commande.total.toLocaleString('fr-FR') }} FCFA</div>
            <div class="text-caption">Code : {{ commande.codeRetrait }}</div>
          </v-card-text>
        </v-card>
        <p v-if="pretes.length === 0" class="text-medium-emphasis text-body-2">Aucune commande</p>
      </v-col>
    </v-row>
  </v-container>
</template>