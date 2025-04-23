import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Khách hàng'
  },
  {
    name: 'Danh sách khách hàng',
    url: '/customers',
    icon: 'cil-address-book'
  },
  {
    title: true,
    name: 'Hợp đồng'
  },
  {
    name:'Danh sách hợp đồng',
    url:'/contract',
    icon:'cil-newspaper'
  },
  {
    title: true,
    name: 'Bán hàng'
  },
  {
    name: 'Bảng giá',
    url: '/buttons',
    icon: 'cil-newspaper',
    children: [
      {
        name: 'BG bảo hiểm',
        url: '/base/cards',
        icon: 'icon-puzzle'
      },
      {
        name: 'BG phụ tùng/phụ kiện',
        url: '/base/carousels',
        icon: 'icon-puzzle'
      }
    ]
  },
  {
    name: 'Chỉ tiêu bán hàng',
    url: '/base',
    icon: 'cil-spreadsheet'
  },
  {
    name: 'Chính sách bán hàng',
    url: '/base',
    icon: 'cil-spreadsheet'
  },
  {
    name: 'Xe khó bán',
    url: '/buttons',
    icon: 'cil-spreadsheet'
  },
  {
    name: 'Khung bán hàng',
    url: '/charts',
    icon: 'cil-spreadsheet'
  },
  {
    title: true,
    name: 'Sản phẩm'
  },
  {
    name: 'Danh sách sản phẩm',
    url: '/product',
    icon: 'cil-car-alt'
  },
  {
    name: 'Tồn kho',
    url: '/buttons',
    icon: 'cil-garage'
  },
  {
    name: 'Màu xe',
    url: '/charts',
    icon: 'icon-pie-chart'
  },
  {
    title: true,
    name: 'Lái thử',
  },
  {
    name: 'Danh sách xe lái thử',
    url: '/pages',
    icon: 'cil-align-left'
  },
  {
    name: 'Cung đường lái thử',
    url: '/dashboard',
    icon: 'cil-loop'
  },
  {
    title: true,
    name: 'Danh mục',
  },
  {
    name: 'Loại lý do',
    url: '/pages',
    icon: 'cil-description'
  },
  {
    name: 'Lý do',
    url: '/dashboard',
    icon: 'cil-description'
  },
  {
    name: 'Kho PT/PK',
    url: '/dashboard',
    icon: 'cil-line-style'
  },
  {
    name: 'Công ty bảo hiểm',
    url: '/dashboard',
    icon: 'cil-building'
  },
  {
    name: 'Ngân hàng',
    url: '/dashboard',
    icon: 'cil-library-building'
  },
  {
    name: 'Chi nhánh',
    url: '/branch',
    icon: 'cil-window'
  },
  {
    name: 'Qui tắc',
    url: '/rule',
    icon: 'cil-window'
  },
  {
    name: 'Hãng xe',
    url: '/brand',
    icon: 'cil-window'
  },
  {
    name: 'Mẫu xe',
    url: '/model',
    icon: 'cil-window'
  },
  {
    title: true,
    name: 'Hệ thống',
  },
  {
    name: 'Vai trò',
    url: '/role',
    icon: 'icon-settings'
  },
  {
    name: 'Vai trò app',
    url: '/role-app',
    icon: 'icon-settings'
  },
  {
    name: 'Người dùng',
    url: '/user',
    icon: 'icon-user'
    //attributes: { disabled: true },
  }
];
