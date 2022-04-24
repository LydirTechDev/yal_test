import { MenuItem } from './menu.model';

export const MENUCOURSIER: MenuItem[] = [
  {
    id: 1,
    label: 'Coursier',
    isTitle: true,
  },
  {
    id: 2,
    label: 'DASHBOARDS',
    icon: 'ri-dashboard-line',
    link: '/coursier',
  },
  {
    id: 3,
    label: 'Colis',
    icon: 'fas fa-box-open',
    subItems: [
      {
        id: 4,
        label: 'Recevoir les colis',
        link: 'receve-shipments',
        parentId: 3,
      },
      {
        id: 5,
        label: 'Colis à livrer',
        link: 'shipment-of-coursier-a-livrer',
        parentId: 3,
      },
      {
        id: 6,
        label: 'Liste des échecs',
        link: 'shipment-echec-coursier',
        parentId: 3,
      },
      {
        id: 7,
        label: 'Pickup',
        link: 'pickup-coursier',
        parentId: 3,
      },
      //   {
      //     id: 6,
      //     label: 'Ramassage des colis',
      //     link: '/app/coursier/ramasser',
      //     parentId: 3,
      //   },
    ],
  },
  {
    id: 8,
    label: 'Mes paiements',
    icon: 'fas fa-cash-register',
    link: 'list-paiement-coursier',
  },
];
