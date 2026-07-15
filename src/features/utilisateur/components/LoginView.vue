<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, register } from '../services/authService'
import { useSessionStore } from '@/stores/session'
import { ApiError } from '@/shared/api/client'

const router = useRouter()
const session = useSessionStore()

const mode = ref<'connexion' | 'inscription'>('connexion')
const email = ref('')
const telephone = ref('')
const motDePasse = ref('')
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
  if (motDePasse.value.length < 8) {
    erreur.value = 'Le mot de passe doit contenir au moins 8 caractères'
    return
  }
  if (mode.value === 'inscription' && !telephoneValide.test(telephone.value)) {
    erreur.value = 'Numéro invalide (format 6XXXXXXXX)'
    return
  }

  chargement.value = true
  try {
    const auth = mode.value === 'connexion'
      ? await login(email.value, motDePasse.value)
      : await register(email.value, telephone.value, motDePasse.value)

    session.definirSession(auth)
    router.push({ name: 'produits' })
  } catch (e) {
    erreur.value = e instanceof ApiError ? e.message : 'Une erreur est survenue'
  } finally {
    chargement.value = false
  }
}
</script>

<template>
  <v-container class="py-8 text-center" style="max-width: 420px">
    <div class="custom-underline"><h1 class="text-h5">Click & Collect 🛍️</h1></div>
    <h2 class="text-h5 mb-8">{{ mode === 'connexion' ? 'Connexion' : 'Créer un compte' }}</h2>

    <v-form @submit.prevent="valider">
      <v-text-field v-model="email" label="Email" type="email" class="mb-2" />
      <v-text-field
        v-if="mode === 'inscription'"
        v-model="telephone"
        label="Téléphone"
        placeholder="6XXXXXXXX"
        maxlength="9"
        class="mb-2"
      />
      <v-text-field v-model="motDePasse" label="Mot de passe" type="password" class="mb-4" />

      <v-alert v-if="erreur" type="error" :text="erreur" class="mb-4" />

      <v-btn type="submit" color="primary" variant="flat" size="large" block :loading="chargement" class="mb-4">
        {{ mode === 'connexion' ? 'Se connecter' : "S'inscrire" }}
      </v-btn>

      <v-btn
        variant="text"
        size="small"
        @click="mode = mode === 'connexion' ? 'inscription' : 'connexion'"
      >
        {{ mode === 'connexion' ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter' }}
      </v-btn>
    </v-form>
  </v-container>
</template>