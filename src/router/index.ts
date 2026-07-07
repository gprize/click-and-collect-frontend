import { createRouter, createWebHistory } from 'vue-router'
import IdentificationView from '@/features/utilisateur/components/IdentificationView.vue'
import MagasinSelectionView from '@/features/magasin/components/MagasinSelectionView.vue'
import ProduitCatalogueView from '@/features/produit/components/ProduitCatalogueView.vue'
import PanierView from '@/features/commande/components/PanierView.vue'
import PaiementMethodeView from '@/features/commande/components/PaiementMethodeView.vue'
import PaiementAttenteView from '@/features/commande/components/PaiementAttenteView.vue'
import CommandeConfirmationView from '@/features/commande/components/CommandeConfirmationView.vue'
import MagasinDashboardView from '@/features/magasin/components/MagasinDashboardView.vue'
import { useSessionStore } from '@/stores/session'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'identification', component: IdentificationView },
    { path: '/magasins', name: 'selection-magasin', component: MagasinSelectionView },
    { path: '/magasins/:magasinId/produits', name: 'produits', component: ProduitCatalogueView },
    { path: '/magasins/:magasinId/panier', name: 'panier', component: PanierView },
    { path: '/commandes/:commandeId/paiement', name: 'paiement-methode', component: PaiementMethodeView },
    { path: '/commandes/:commandeId/paiement/:operateur', name: 'paiement-attente', component: PaiementAttenteView },
    { path: '/commandes/:commandeId/confirmation', name: 'commande-confirmation', component: CommandeConfirmationView },
    { path: '/magasins/:magasinId/dashboard', name: 'magasin-dashboard', component: MagasinDashboardView }
  ]
})

router.beforeEach((to) => {
  const session = useSessionStore()
  if (to.name !== 'identification' && !session.utilisateurId) {
    return { name: 'identification' }
  }
})

export default router