  import { MenuItem } from './menu.model';

  export const MENUFINANCE: MenuItem[] = [
    {
      id: 1,
      label: 'Finance',
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
    label: 'Récoltes',
    icon: 'fas fa-money-bill-wave',
    subItems: [
      {
        id: 4,
        label: 'Recevoir les récoltes',
        link: '/finance/recever-recoltes',
        parentId: 3,
      },
      {
        id: 5,
        label: 'liste des récoltes',
        link: '/finance/liste-recoltes',
        parentId: 3,
      },
    ],
  },
  {
    id: 6,
    label: 'Paiement',
    icon: 'fa fa-hand-holding-usd',
    subItems: [
      {
        id: 7,
        label: 'Libérer un paiement',
        link: '/finance/liberer-paiement',
        parentId: 6,
      },
      {
        id: 8,
        label: 'Procéder aux paiements',
        link: '/finance/proceder-paiement',
        parentId: 6,
      },
      {
        id: 9,
        label: 'Payer coursier',
        link: '/finance/payer-coursier',
        parentId: 6,
      },
      {
        id: 10,
        label: 'Liste paiements coursier',
        link: '/finance/list-paiements-coursier',
        parentId: 6,
      },
      {
        id: 11,
        label: 'Liste paiements',
        link: '/finance/list-paiements',
        parentId: 6,
      },
    ],
  },
  {
    id: 12,
    label: 'FACTURATION',
    icon: 'ri-exchange-dollar-line',
    link: '/finance/facturation',
    subItems: [
      {
        id: 13,
        label: 'Dashboard',
        icon: 'ri-dashboard-line',
        link: '/finance/facturation/dashboard',
        parentId: 12,
      },

      {
        id: 14,
        label: 'Classique',
        icon: 'ri-dashboard-line',
        parentId: 12,
        subItems: [
          {
            id: 15,
            label: 'Facturer',
            icon: 'ri-dashboard-line',
            link: '/finance/facturer-classique',
            parentId: 14,
          },

          {
            id: 16,
            label: 'Factures non payées',
            icon: 'ri-dashboard-line',
            link: '/finance/list-facture-non-payer',
            parentId: 14,
          },
          {
            id: 17,
            label: 'Factures payées',
            icon: 'ri-dashboard-line',
            link: '/finance/list-facture-payer',
            parentId: 14,
          },
        ],
      },

      {
        id: 18,
        label: 'E-Commerce',
        icon: 'ri-dashboard-line',
        parentId: 12,
        subItems: [
          {
            id: 19,
            label: 'Facturer',
            icon: 'ri-dashboard-line',
            link: '/finance/facturer-e-commerce',
            parentId: 18,
          },
          {
            id: 20,
            label: 'Liste des factures',
            icon: 'ri-dashboard-line',
            link: '/finance/list-factures-e-commerce',
            parentId: 18,
          },
        ],
      },
      {
        id: 21,
        label: 'Sans recouvrement',
        icon: 'ri-dashboard-line',
        parentId: 12,
        subItems: [
          {
            id: 22,
            label: 'Facturer',
            icon: 'ri-dashboard-line',
            link: '/finance/facturer-zero',
            parentId: 21,
          },

          {
            id: 23,
            label: 'Factures non payées',
            icon: 'ri-dashboard-line',
            link: '/finance/list-facture-zero-non-payer',
            parentId: 21,
          },
          {
            id: 24,
            label: 'Factures payées',
            icon: 'ri-dashboard-line',
            link: '/finance/list-facture-zero-payer',
            parentId: 21,
          },
        ],
      },
    ],
  },
  {
    id: 25,
    label: 'Colis',
    icon: 'fas fa-box-open',
    subItems: [
      {
        id: 26,
        label: 'Colis internes',
        link: '/operations/interne-shipment',
        parentId: 25,
      },
    ],
  },
];
