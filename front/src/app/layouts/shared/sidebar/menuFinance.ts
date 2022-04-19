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
    link: '/finance/tarifications',
    subItems: [
      {
        id: 13,
        label: 'Facturer',
        icon: 'ri-dashboard-line',
        link: '/finance/facturer',
        parentId: 12,
      },

      {
        id: 14,
        label: 'Factures non payées',
        icon: 'ri-dashboard-line',
        link: '/finance/list-facture-non-payer',
        parentId: 12,
      },
      {
        id: 15,
        label: 'Factures payées',
        icon: 'ri-dashboard-line',
        link: '/finance/list-facture-payer',
        parentId: 12,
      },

    ],
  },
  {
    id: 16,
    label: 'Colis',
    icon: 'fas fa-box-open',
    subItems: [
      {
        id: 17,
        label: 'Colis internes',
        link: '/operations/interne-shipment',
        parentId: 16,
      },
    ],
  },
];
