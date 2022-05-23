import { MenuItem } from './menu.model';

export const MENUOPS: MenuItem[] = [
  {
    id: 1,
    label: 'Menu',
    isTitle: true,
  },
  {
    id: 2,
    label: 'Tableau de bord',
    icon: 'ri-dashboard-line',
    link: '/operations',
  },
  {
    id: 3,
    label: 'Colis',
    icon: 'fas fa-box-open',
    subItems: [
      {
        id: 4,
        label: 'Expédition',
        link: '/operations/receive-shipment',
        parentId: 3,
      },
      {
        id: 19,
        label: 'Affecté au corsier',
        icon: 'ri-dashboard-line',
        link: '/operations/affecter-au-coursier',
        parentId: 18,
      },
      {
        id: 5,
        label: 'Colis internes',
        link: '/operations/interne-shipment',
        parentId: 3,
      },
      {
        id: 26,
        label: 'Liste des colis',
        link: '/operations/list-shipments',
        parentId: 3,
      },
    ],
  },
  {
    id: 7,
    label: 'Sac',
    icon: 'fas fa-map-signs',
    subItems: [
      {
        id: 8,
        label: 'Créer sac transfert',
        link: '/operations/create-transfert-sac',
        parentId: 7,
      },
      {
        id: 9,
        label: 'Créer sac vers wilaya',
        link: '/operations/create-wilaya-sac',
        parentId: 7,
      },
      {
        id: 10,
        label: 'Vider sac transfert',
        link: '/operations/vidé-transfert-sac',
        parentId: 7,
      },
      {
        id: 11,
        label: 'Vider sac vers wilaya',
        link: '/operations/vidé-wilaya-sac',
        parentId: 7,
      },
      {
        id: 12,
        label: 'Créer sac vers agence',
        link: '/operations/create-agence-sac',
        parentId: 7,
      },
      {
        id: 13,
        label: 'Vider sac agence',
        link: '/operations/vider-agence-sac',
        parentId: 7,
      },
      {
        id: 25,
        label: 'Tous les sacs',
        link: '/operations/listesacs',
        parentId: 7,
      },
      
    ],
  },
  {
    id: 13,
    label: 'Retour',
    icon: 'fa fa-reply-all',
    subItems: [
      {
        id: 14,
        label: 'Recever le retour coursier',
        link: '/operations/retour/recever-retour-coursier',
        parentId: 13,
      },
      {
        id: 15,
        label: 'Créer sac R-transfert',
        link: '/operations/retour/create-transfert-sac-retour',
        parentId: 13,
      },
      {
        id: 16,
        label: 'Créer sac R-wilaya',
        link: '/operations/retour/create-wilaya-sac-retour',
        parentId: 13,
      },
      {
        id: 17,
        label: 'Vider sac R-transfert',
        link: '/operations/retour/vidé-transfert-sac-retour',
        parentId: 13,
      },
      {
        id: 18,
        label: 'Vider sac R-wilaya',
        link: '/operations/retour/vidé-wilaya-sac-retour',
        parentId: 13,
      },


      {
        id: 19,
        label: 'Créer sac R-agence',
        link: '/operations/retour/creer-agence-sac-retour',
        parentId: 13,
      },
      {
        id: 20,
        label: 'Vider sac R-agence',
        link: '/operations/retour/vidé-agence-sac-retour',
        parentId: 13,
      },
      {
        id: 21,
        label: 'Créer sac R-client',
        link: '/operations/retour/creer-client-sac-retour',
        parentId: 13,
      },
      {
        id: 22,
        label: 'Remetre colis au client',
        link: '/operations/retour/remetre-au-client',
        parentId: 13,
      },

    ],
  },
  {
    id: 25,
    label: 'Livraison',
    icon: 'fas fa-shipping-fast',
    subItems: [
      {
        id:26 ,
        label: 'Colis à livrer',
        link: '/operations/shipment-livraison',
        parentId: 25,
      },
      {
        id: 27,
        label: 'Liste des échecs',
        link: '/operations/shipment-echec-livraison',
        parentId: 25,
      }],
  },
  {
    id: 23,
    label: 'Récoltes',
    icon: 'fas fa-money-bill-wave',
    subItems: [
      {
        id: 24,
        label: 'Créer récolte coursier',
        link: '/operations/cree-recolte',
        parentId: 23,
      },
      {
        id: 24,
        label: 'Créer récolte DESK',
        link: '/operations/cree-recoltedesk',
        parentId: 23,
      },
      
      {
        id: 25,
        label: 'Mes récoltes',
        link: '/operations/mes-recoltes',
        parentId: 23,
      },
    ],
  },
  {
    id: 24,
    label: 'Transiter sac',
    icon: 'ri-arrow-up-down-line',
    link: '/operations/transiter-sac',
  }
];
