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
    label: 'Nouveaux envois',
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
    ],
  },
];
