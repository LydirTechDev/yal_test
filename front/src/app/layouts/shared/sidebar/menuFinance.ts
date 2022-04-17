import { MenuItem } from './menu.model';

export const MENUFINANCE: MenuItem[] = [
  {
    id: 1,
    label: 'caissier-central',
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
        label: 'Recever les récoltes',
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
    label: 'Colis',
    icon: 'fas fa-box-open',
    subItems: [
      {
        id: 13,
        label: 'Colis internes',
        link: '/operations/interne-shipment',
        parentId: 12,
      },
    ],
  },
];
