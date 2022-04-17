export interface IshippmentsClient {
  raisonSociale: string;
  nom: string;
  prenom: string;
  telephone: string;
  adresse: string;
  numCommande: string;
  designationProduit: string;
  objetRecuperer?: string;
  serviceId: number;
  communeId: number;
  prixVente: number;
  poids: number;
  longeur: number;
  largeur: number;
  hauteur: number;
  echange?: boolean;
  livraisonGratuite: boolean;
  ouvrireColis: boolean;
  livraisonStopDesck: boolean;
  livraisonDomicile: boolean;
}
