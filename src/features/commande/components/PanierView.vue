<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePanierStore } from '@/stores/panier'
import { useSessionStore } from '@/stores/session'
import { creerCommande } from '../services/commandeService'

const router = useRouter()
const panier = usePanierStore()
const session = useSessionStore()

const validationEnCours = ref(false)
const erreur = ref<string | null>(null)

async function validerCommande() {
  validationEnCours.value = true
  erreur.value = null

  try {
    const commande = await creerCommande({
      utilisateurId: session.utilisateurId!,
      magasinId: session.magasinId,
      lignes: panier.lignes.map((l) => ({
        produitId: l.produitId,
        quantite: l.quantite
      }))
    })

    panier.viderPanier()
    router.push({ name: 'paiement-methode', params: { commandeId: commande.id } })
  } catch {
    erreur.value = 'Impossible de valider la commande. Vérifiez le stock disponible.'
  } finally {
    validationEnCours.value = false
  }
}
</script>

<template>
  <v-container class="py-8">
    <h1 class="text-h5 mb-6">Votre panier</h1>

    <v-alert v-if="panier.lignes.length === 0" type="info" text="Votre panier est vide" />

    <template v-else>
      <v-list>
        <v-list-item v-for="ligne in panier.lignes" :key="ligne.produitId">
          <v-list-item-title>{{ ligne.nom }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ ligne.prixUnitaire.toLocaleString('fr-FR') }} FCFA × {{ ligne.quantite }}
          </v-list-item-subtitle>

          <template #append>
            <v-btn icon="mdi-minus" size="small" variant="text" @click="panier.diminuer(ligne.produitId)" />
            <span class="mx-2">{{ ligne.quantite }}</span>
            <v-btn
              icon="mdi-plus"
              size="small"
              variant="text"
              :disabled="ligne.quantite >= panier.QUANTITE_MAX_PAR_LIGNE"
              @click="panier.augmenter(ligne.produitId)"
            />
          </template>
        </v-list-item>
      </v-list>

      <v-divider class="my-4" />

      <div class="d-flex justify-space-between text-h6 mb-6">
        <span>Total</span>
        <span>{{ panier.total.toLocaleString('fr-FR') }} FCFA</span>
      </div>

      <v-alert v-if="erreur" type="error" :text="erreur" class="mb-4" />

      <v-btn
        color="primary"
        variant="flat"
        size="large"
        block
        :loading="validationEnCours"
        @click="validerCommande"
      >
        Valider la commande
      </v-btn>
    </template>
  </v-container>
</template>