import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { creerVuetify } from './plugins/vuetify'
import { useMagasinStore } from './stores/magasin'

async function demarrer() {
  const app = createApp(App)
  const pinia = createPinia()
  app.use(pinia)

  const magasinStore = useMagasinStore()
  await magasinStore.charger()

  const couleurPrimaire = magasinStore.magasin?.couleurPrimaire ?? '#3B6B3E'
  const couleurSecondaire = magasinStore.magasin?.couleurSecondaire ?? '#B23A2E'
  const vuetify = creerVuetify(couleurPrimaire, couleurSecondaire)

  app.use(router)
  app.use(vuetify)
  app.mount('#app')
}

demarrer()