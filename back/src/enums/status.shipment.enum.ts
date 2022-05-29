export enum StatusShipmentEnum {
  enPreparation = 'EN PREPARATION',
  enAttenteDeLiveraison = 'EN ATTENTE DE LIVRAISON',
  presExpedition = 'PRÉS A EXPIDIÉ',
  ramasse = 'RAMASSÉ',
  expidie = 'EXPIDIÉ',
  versWilaya = 'VERS WILAYA',
  versAgence = 'VERS AGENCE',
  recueAgence = 'REÇUE AGENCE',
  transfert = 'TRANSFERT',
  recueWilaya = 'REÇUE WILAYA',
  centre = 'CENTRE',
  //retour
  retourneAgence = 'RETOURNÉ EN AGENCE',
  retourneCentre = 'RETOURNE AU CENTRE', // retourne vers le centre
  centreRetour = 'CENTRE RETOUR', //en cours de traitement
  returnVersWilaya = 'RETOUR VERS WILAYA',
  transit = 'TRANSITÉ',
  retourVersAgence = 'RETOUR VERS AGENCE',
  retourRecuWilaya = 'RETOUR REÇU WILAYA',
  retourRecuAgence = 'RETOUR REÇU AGENCE',
  ARetirer = 'A RETIRÉ',
  retirer = 'RETIRÉ',
  retourPayer = 'RETOUR PAYÉ',

  // livraison
  affectedToCoursier = 'AFFECTER AU COURSIER',
  sortiEnLivraison = 'SORTI EN LIVRASON',
  enAlerte = 'EN ALERTE',
  tentativeEchoue = 'TENTATIVE ECHOUÉE',
  enAttenteDuClient = 'EN ATTENTE DU CLIENT',
  echecLivraison = 'ÉCHEC LIVRAISON',
  livre = 'LIVRÉ',

  // echange
  enAttenteDeChangement = 'EN ATTENTE DE CHANGEMENT',
  echange = 'ECHANGÉ',

  // finance
  pasPres = 'PAS PRÉS',
  preRecolte = 'PRÉS RÉCOLTÉ',
  recolte = 'RÉCOLTÉ',
  pretAPayer = 'PRÉT A PAYER',
  payer = 'PAYER',

  //facture
  facturer = 'FACTURÉ',
}
