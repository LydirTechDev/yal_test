import { MenuItem } from './menu.model';

export const MENUMANAGER: MenuItem[] = [
    {
        id: 1,
        label: 'Manager',
        isTitle: true,
    },
    {
        id: 2,
        label: 'Tableau de bord',
        icon: 'ri-dashboard-line',
        link: '/manager',
    },  
    {
        id: 3,
        label: 'Statistique par status',
        icon: 'fas fa-chart-line',
        subItems: [
            {
                id: 4,
                label: 'Statistique OPS',
                link: 'statistiqueOPS',
                parentId: 3,
            },
            {
                id: 5,
                label: 'Statistique Finance',
                link: 'statistiqueFinance',
                parentId: 3,
            }, ]}
            ,      
]