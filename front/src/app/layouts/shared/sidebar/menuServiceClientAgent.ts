import { MenuItem } from './menu.model';

export const MENUSEVICECLIENT: MenuItem[] = [
  {
    id: 1,
    label: 'Menu - Service client',
    isTitle: true,
  },
  {
    id: 2,
    label: 'Tableau de bord',
    icon: 'ri-dashboard-line',
    link: '/service-client',
  },
  {
    id: 3,
    label: 'Colis',
    icon: 'fas fa-box-open',
    subItems: [
      {
        id: 4,
        label: 'Classique',
        link: '/service-client/classique',
        parentId: 3,
      },
      {
        id: 5,
        label: 'Retrait cahier de charge',
        link: '/service-client/retrait-cahier-de-charge',
        parentId: 3,
      },
      {
        id: 6,
        label: 'Soumission',
        link: '/service-client/soumission',
        parentId: 3,
      },
      // {
      //   id: 6,
      //   label: 'Liste des colis',
      //   link: '/service-client/liste-shipments',
      //   parentId: 3,
      // },
    ],
  },
  {
    id: 7,
    label: 'Récoltes',
    icon: 'fas fa-money-bill-wave',
    subItems: [
      {
        id: 8,
        label: 'Créer récolte',
        link: '/service-client/cree-recolte',
        parentId: 7,
      },
      {
        id: 8,
        label: 'Liste récolte',
        link: '/service-client/liste-recolte',
        parentId: 7,
      },
      // {
      //   id: 9,
      //   label: 'Créer récolte DESK',
      //   link: '/operations/cree-recoltedesk',
      //   parentId: 7,
      // },

      // {
      //   id: 10,
      //   label: 'Mes récoltes',
      //   link: '/operations/mes-recoltes',
      //   parentId: 7,
      // },
    ],
  },
];
