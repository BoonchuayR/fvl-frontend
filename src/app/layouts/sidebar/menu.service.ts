import { MenuItem } from './menu.model';

export const MENU_SERVICE: MenuItem[] = [
    {
        id: 6,
        label: 'มิเตอร์ไฟฟ้า',
        icon: 'bx bx-bulb',
        link: '/meter-dashboard',
    },
    {
        id: 8,
        label: 'แจ้งซ่อม',
        icon: 'bx bx-wrench',
        link: '/ticket-list',
    },
    {
        id: 10,
        isLayout: true
    }
];

