<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import type { OperateurPaiement } from '../types'

const route = useRoute()
const router = useRouter()

const commandeId = route.params.commandeId as string

function choisir(operateur: OperateurPaiement) {
  router.push({ name: 'paiement-attente', params: { commandeId, operateur } })
}
</script>

<template>
  <v-container class="py-8" style="max-width: 480px">
    <h1 class="text-h5 mb-2 text-center">Choisissez votre moyen de paiement</h1>
    <p class="text-body-2 text-medium-emphasis text-center mb-8">
      Paiement sécurisé par Mobile Money
    </p>

    <v-card class="mb-4 pa-4" hover @click="choisir('MTN_MOMO')">
      <div class="d-flex align-center">
        <v-avatar color="#FFCC00" size="48" class="mr-4">
          <span class="text-black font-weight-bold text-caption">MoMo</span>
        </v-avatar>
        <div>
          <div class="font-weight-medium">MTN Mobile Money</div>
          <div class="text-caption text-medium-emphasis">Payer avec mon compte MoMo</div>
        </div>
        <v-spacer />
        <v-icon icon="mdi-chevron-right" />
      </div>
    </v-card>

    <v-card class="pa-4" hover @click="choisir('ORANGE_MONEY')">
      <div class="d-flex align-center">
        <v-avatar color="#FF7900" size="48" class="mr-4">
          <span class="text-white font-weight-bold text-caption">OM</span>
        </v-avatar>
        <div>
          <div class="font-weight-medium">Orange Money</div>
          <div class="text-caption text-medium-emphasis">Payer avec mon compte Orange Money</div>
        </div>
        <v-spacer />
        <v-icon icon="mdi-chevron-right" />
      </div>
    </v-card>
  </v-container>
</template>