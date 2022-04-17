
import { MenuItem } from './menu.model';

export const MENUCLIENT: MenuItem[] = [
    {
        id: 1,
        // label: 'MENUITEMS.MENU.TEXT',
        label: 'Menu',
        isTitle: true
    },
    {
        id: 2,
        // label: 'MENUITEMS.DASHBOARDS.TEXT',
        label: 'Tableau de bord',
        icon: 'ri-dashboard-line',
        link: '/client'
    },
    {
        id: 3,
        // label: 'MENUITEMS.PACKINGSLIP.TEXT',
        label: 'Mes colis',
        icon: 'fas fa-mail-bulk',
        link: '/client/colis'
    },
    {
        id: 4,
        // label: 'MENUITEMS.ACTIVITY.TEXT',
        label: 'Traçabilité',
        icon: 'fas fa-shipping-fast',
        link: '/client/colis/tracabilite'
    },
    // {
    //     id: 5,
    //     label: 'MENUITEMS.RECOVERIES.TEXT',
    //     icon: 'ri-dashboard-line',
    //     link: '/app/client/recouvrements'
    // },
    // {
    //     id: 6,
    //     label: 'MENUITEMS.RETURNS.TEXT',
    //     icon: 'ri-dashboard-line',
    //     link: '/app/client/retours'
    // },
];
