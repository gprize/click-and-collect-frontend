import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/features/utilisateur/components/LoginView.vue'
import ProduitCatalogueView from '@/features/produit/components/ProduitCatalogueView.vue'
import PanierView from '@/features/commande/components/PanierView.vue'
import PaiementMethodeView from '@/features/commande/components/PaiementMethodeView.vue'
import PaiementAttenteView from '@/features/commande/components/PaiementAttenteView.vue'
import CommandeConfirmationView from '@/features/commande/components/CommandeConfirmationView.vue'
import NotFoundView from '@/features/shared/components/NotFoundView.vue'
import { useSessionStore } from '@/stores/session'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: LoginView },
    { path: '/', name: 'produits', component: ProduitCatalogueView },
    { path: '/panier', name: 'panier', component: PanierView },
    { path: '/commandes/:commandeId/paiement', name: 'paiement-methode', component: PaiementMethodeView },
    { path: '/commandes/:commandeId/paiement/:operateur', name: 'paiement-attente', component: PaiementAttenteView },
    { path: '/commandes/:commandeId/confirmation', name: 'commande-confirmation', component: CommandeConfirmationView },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView }
  ]
})

router.beforeEach((to) => {
  const session = useSessionStore()
  if (to.name !== 'login' && to.name !== 'not-found' && !session.estConnecte()) {
    return { name: 'login' }
  }
})

export default router