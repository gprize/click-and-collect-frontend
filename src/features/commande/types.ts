export type StatutCommande =
  | 'EN_ATTENTE_PAIEMENT'
  | 'PAYEE'
  | 'EN_PREPARATION'
  | 'PRETE'
  | 'RECUPEREE'
  | 'ANNULEE'

export interface LigneCommandeRequest {
  produitId: string
  quantite: number
}

export interface CommandeRequest {
  utilisateurId: string
  magasinId: string
  lignes: LigneCommandeRequest[]
}

export interface LigneCommandeResponse {
  produitId: string
  produitNom: string
  quantite: number
  prixUnitaire: number
  sousTotal: number
}

export interface CommandeResponse {
  id: string
  utilisateurId: string
  magasinId: string
  statut: StatutCommande
  codeRetrait: string | null
  total: number
  lignes: LigneCommandeResponse[]
}

export type OperateurPaiement = 'MTN_MOMO' | 'ORANGE_MONEY'