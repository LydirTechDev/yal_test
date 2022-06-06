import { MenuItem } from './menu.model';

export const MENUADMIN: MenuItem[] = [
  {
    id: 1,
    label: 'Menu - Admin',
    isTitle: true,
  },
  {
    id: 2,
    label: 'DASHBOARDS',
    icon: 'ri-dashboard-line',
    link: '/admin',
  },
  {
    id: 3,
    label: 'UTILISATEURS',
    icon: 'fas fa-users',
    link: '/admin/users',
    subItems: [
      {
        id: 11,
        label: 'Utilisateur',
        icon: 'fas fa-users',
        link: '/admin/users',
        parentId: 3,
      },
      {
        id: 12,
        label: 'Freelance',
        icon: 'fas fa-users',
        link: '/admin/coursier',
        parentId: 3,
      },
      {
        id: 13,
        label: 'Employé',
        icon: 'fas fa-users',
        link: '/admin/employé',
        parentId: 3,
      },
      {
        id: 14,
        label: 'Client',
        icon: 'fas fa-users',
        link: '/admin/client',
        parentId: 3,
      },
    ],
  },
  {
    id: 4,
    label: 'PARAMETRAGE',
    icon: 'ri-compass-3-line',
    link: '/admin/wilaya',
    subItems: [
      {
        id: 5,
        label: 'Wilayas',
        icon: 'ri-dashboard-line',
        link: '/admin/wilaya',
        parentId: 4,
      },
      {
        id: 6,
        label: 'Communes',
        icon: 'ri-dashboard-line',
        link: '/admin/commune',
        parentId: 4,
      },
      {
        id: 7,
        label: 'Agences',
        icon: 'ri-dashboard-line',
        link: '/admin/agence',
        parentId: 4,
      },
      // {
      //   id: 8,
      //   label: 'Zones',
      //   icon: 'ri-dashboard-line',
      //   link: '/admin/zones',
      //   parentId: 8,
      // },
      {
        id: 9,
        label: 'Rotations',
        icon: 'ri-dashboard-line',
        link: '/admin/rotations',
        parentId: 8,
      },
    ],
  },
  {
    id: 10,
    label: 'TARIFICATONS',
    icon: 'ri-exchange-dollar-line',
    link: '/admin/tarifications',
    subItems: [
      // {
      //           id: 11,
      //           label: 'Plages de poids',
      //           icon: 'ri-dashboard-line',
      //           link: '/admin/plages-poids',
      //           parentId: 3
      // },
    ],
  },
  //     {
  //         id: 7,
  //         label: 'MENUITEMS.SETTINGS.LIST.AGENTS',
  //         icon: 'ri-dashboard-line',
  //         link: '/app/employe/parametrage/agents',
  //         parentId: 3
  //     },
  //     {
  //         id: 8,
  //         label: 'MENUITEMS.SETTINGS.LIST.COURSIERS',
  //         icon: 'ri-dashboard-line',
  //         link: '/app/employe/parametrage/coursiers',
  //         parentId: 3
  //     },
  //     {
  //         id: 9,
  //         label: 'MENUITEMS.SETTINGS.LIST.USERS',
  //         icon: 'ri-dashboard-line',
  //         link: '/app/employe/parametrage/users',
  //         parentId: 3
  //     },
  //     {
  //         id: 10,
  //         label: 'MENUITEMS.SETTINGS.LIST.AGENCIES',
  //         icon: 'ri-dashboard-line',
  //         link: '/app/employe/parametrage/agencies',
  //         parentId: 3
  //     },
  //     {
  //         id: 11,
  //         label: 'MENUITEMS.SETTINGS.LIST.FONCTIONS',
  //         icon: 'ri-dashboard-line',
  //         link: '/app/employe/parametrage/fonctions',
  //         parentId: 3
  //     },
  //     {
  //         id: 12,
  //         label: 'MENUITEMS.SETTINGS.LIST.PRICES',
  //         icon: 'ri-dashboard-line',
  //         link: '/app/employe/parametrage/prices',
  //         parentId: 3
  //     },
  // ]
  // }
  // {
  //     id: 13,
  //     label: 'MENUITEMS.OPERATIONS.TEXT',
  //     icon: 'ri-dashboard-line',
  //     subItems: [
  //         {
  //             id: 14,
  //             label: 'MENUITEMS.OPERATIONS.LIST.DASHBOARDS',
  //             icon: 'ri-dashboard-line',
  //             link: '/app/employe/operations',
  //             parentId: 13,

  //         },
  //         {
  //             id: 14,
  //             label: 'MENUITEMS.OPERATIONS.LIST.RECIEVE.TEXT',
  //             icon: 'ri-dashboard-line',
  //             parentId: 13,
  //             subItems: [
  //                 {
  //                     id: 15,
  //                     label: 'MENUITEMS.OPERATIONS.LIST.RECIEVE.LIST.PACKAGES',
  //                     icon: 'ri-dashboard-line',
  //                     link: '/app/employe/operations/recieve/packages',
  //                     parentId: 14,
  //                 },
  //                 {
  //                     id: 16,
  //                     label: 'MENUITEMS.OPERATIONS.LIST.RECIEVE.LIST.RETURNS',
  //                     icon: 'ri-dashboard-line',
  //                     link: '/app/employe/operations/recieve/returns',
  //                     parentId: 14,
  //                 },
  //                 {
  //                     id: 17,
  //                     label: 'MENUITEMS.OPERATIONS.LIST.RECIEVE.LIST.BAGS',
  //                     icon: 'ri-dashboard-line',
  //                     link: '/app/employe/operations/recieve/bags',
  //                     parentId: 14,
  //                 },

  //             ]
  //         }
  //     ]
  // },
];
