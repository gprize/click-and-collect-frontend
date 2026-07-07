<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { simulerPaiement } from '../services/commandeService'
import type { OperateurPaiement } from '../types'

const route = useRoute()
const router = useRouter()

const commandeId = route.params.commandeId as string
const operateur = route.params.operateur as OperateurPaiement

const etape = ref<'saisie' | 'attente' | 'erreur'>('saisie')
const telephone = ref('')

const config = computed(() =>
  operateur === 'MTN_MOMO'
    ? { nom: 'MTN Mobile Money', couleur: '#FFCC00', texte: 'black', instruction: 'Composez *126# pour valider le paiement' }
    : { nom: 'Orange Money', couleur: '#FF7900', texte: 'white', instruction: 'Entrez votre code secret Orange Money reçu par notification' }
)

const telephoneValide = computed(() => /^6\d{8}$/.test(telephone.value))

async function lancerPaiement() {
  etape.value = 'attente'
  try {
    // Simulation de l'attente de confirmation côté opérateur (3-4s, comme un vrai push USSD)
    await new Promise((resolve) => setTimeout(resolve, 5500))
    // TODO : remplacer par le vrai callback de l'agrégateur de paiement (webhook), pas un appel direct ici
    await simulerPaiement(commandeId)
    router.push({ name: 'commande-confirmation', params: { commandeId } })
  } catch {
    etape.value = 'erreur'
  }
}
</script>

<template>
  <v-container class="py-8 text-center" style="max-width: 480px">
    <v-avatar :color="config.couleur" size="56" class="mb-4">
      <span :class="`text-${config.texte}`" class="font-weight-bold">
        {{ operateur === 'MTN_MOMO' ? 'MoMo' : 'OM' }}
      </span>
    </v-avatar>

    <template v-if="etape === 'saisie'">
      <h1 class="text-h6 mb-6">Paiement via {{ config.nom }}</h1>
      <v-form @submit.prevent="lancerPaiement">
        <v-text-field
          v-model="telephone"
          label="Numéro de téléphone"
          placeholder="6XXXXXXXX"
          maxlength="9"
          :rules="[() => telephoneValide || 'Numéro invalide']"
        />
        <v-btn
          type="submit"
          color="primary"
          variant="flat"
          size="large"
          block
          :disabled="!telephoneValide"
        >
          Payer
        </v-btn>
      </v-form>
    </template>

    <template v-else-if="etape === 'attente'">
      <v-progress-circular indeterminate color="primary" size="56" class="mb-6" />
      <h1 class="text-h6 mb-2">En attente de confirmation</h1>
      <p class="text-body-2 text-medium-emphasis">{{ config.instruction }}</p>
    </template>

    <template v-else>
      <v-alert type="error" text="Le paiement a échoué. Veuillez réessayer." class="mb-4" />
      <v-btn variant="tonal" @click="etape = 'saisie'">Réessayer</v-btn>
    </template>
  </v-container>
</template>