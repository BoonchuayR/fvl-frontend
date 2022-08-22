import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'เมนูหลัก',
        isTitle: true
    },
    {
        id: 2,
        label: 'หน้าหลัก',
        icon: 'bx bx-home-circle',
        link: '',
    },
    {
        id: 3,
        label: 'ผู้ใชังาน',
        icon: 'bx bx-user',
        link: '/user-list',
    },
    {
        id: 4,
        label: 'ร้านค้า',
        icon: 'bx bxs-store',
        link: '/shop-list',
    },
    {
        id: 5,
        label: 'มิเตอร์ไฟฟ้า',
        icon: 'bx bx-bulb',
        link: '/meter-dashboard',
    },
    {
        id: 6,
        label: 'เติมเงิน',
        icon: 'bx bx-money',
        link: '/topup-list',
    },
    // {
    //     id: 7,
    //     label: 'แจ้งเหตุขัดข้อง',
    //     icon: 'bx bx-wrench',
    //     link: '/repair-list',
    // },
    // {
    //     id: 8,
    //     label: 'แจ้งเตือน',
    //     icon: 'bx bx-stopwatch',
    //     link: '/announce-list',
    // },
    {
        id: 10,
        isLayout: true
    }
];

