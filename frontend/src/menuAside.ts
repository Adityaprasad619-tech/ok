import * as icon from '@mdi/js';
import { MenuAsideItem } from './interfaces'

const menuAside: MenuAsideItem[] = [
  {
    href: '/dashboard',
    icon: icon.mdiViewDashboardOutline,
    label: 'Dashboard',
  },

  {
    href: '/users/users-list',
    label: 'Users',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiAccountGroup ?? icon.mdiTable,
    permissions: 'READ_USERS'
  },
  {
    href: '/campaigns/campaigns-list',
    label: 'Campaigns',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiBullhorn' in icon ? icon['mdiBullhorn' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_CAMPAIGNS'
  },
  {
    href: '/coupons/coupons-list',
    label: 'Coupons',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiTicket' in icon ? icon['mdiTicket' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_COUPONS'
  },
  {
    href: '/creators/creators-list',
    label: 'Creators',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiAccountStar' in icon ? icon['mdiAccountStar' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_CREATORS'
  },
  {
    href: '/subscriptions/subscriptions-list',
    label: 'Subscriptions',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiRepeat' in icon ? icon['mdiRepeat' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_SUBSCRIPTIONS'
  },
  {
    href: '/transactions/transactions-list',
    label: 'Transactions',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiSwapHorizontal' in icon ? icon['mdiSwapHorizontal' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_TRANSACTIONS'
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: icon.mdiAccountCircle,
  },

 {
    href: '/api-docs',
    target: '_blank',
    label: 'Swagger API',
    icon: icon.mdiFileCode,
    permissions: 'READ_API_DOCS'
  },
]

export default menuAside
