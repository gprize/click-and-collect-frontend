<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { creerUtilisateur, fetchUtilisateurParEmail } from '../services/utilisateurService'
import { useSessionStore } from '@/stores/session'
import { ApiError } from '@/shared/api/client'

const router = useRouter()
const session = useSessionStore()

const email = ref('')
const telephone = ref('')
const chargement = ref(false)
const erreur = ref<string | null>(null)

const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const telephoneValide = /^6\d{8}$/

async function valider() {
  erreur.value = null

  if (!emailValide.test(email.value)) {
    erreur.value = 'Email invalide'
    return
  }
  if (!telephoneValide.test(telephone.value)) {
    erreur.value = 'Numéro invalide (format 6XXXXXXXX)'
    return
  }

  chargement.value = true
  try {
    const utilisateur = await creerUtilisateur(email.value, telephone.value)
    session.identifierUtilisateur(utilisateur.id)
    router.push({ name: 'selection-magasin' })
  } catch (e) {
    // Email déjà utilisé : on considère ça comme une connexion réussie (pas de vraie auth pour l'instant)
    if (e instanceof ApiError && e.status === 409) {
      try {
        const utilisateur = await fetchUtilisateurParEmail(email.value)
        session.identifierUtilisateur(utilisateur.id)
        router.push({ name: 'selection-magasin' })
        return
      } catch {
        erreur.value = 'Une erreur est survenue'
        return
      }
    }
    erreur.value = 'Impossible de vous identifier'
  } finally {
    chargement.value = false
  }
}
</script>

<template>
  <v-container class="py-8 text-center" style="max-width: 420px">
    <div class="custom-underline"><h1 class="text-h5">Click & Collect 🛍️</h1></div>
    <h2 class="text-h5 mb-8">Connexion</h2>

    <v-form @submit.prevent="valider">
      <v-text-field v-model="email" label="Email" type="email" class="mb-2" />
      <v-text-field v-model="telephone" label="Téléphone" placeholder="6XXXXXXXX" maxlength="9" class="mb-4" />

      <v-alert v-if="erreur" type="error" :text="erreur" class="mb-4" />

      <v-btn type="submit" color="primary" variant="flat" size="large" block :loading="chargement">
        Commencez vos courses
      </v-btn>
    </v-form>
  </v-container>
</template>