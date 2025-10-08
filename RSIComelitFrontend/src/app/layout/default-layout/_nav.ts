import {INavData} from '@coreui/angular';

const commonNavItems: INavData[] = [

  {
    name: 'Posts',
    url: '/user/list-post',
    iconComponent: {name: 'cil-list'},
    badge: {
      color: 'danger',
      text: 'NEW',
    },
  },
  {
    name: 'RSI Comelit',
    title: true,
  },
  {
    name: 'Profile',
    url: '/user/edit-profile',
    iconComponent: {name: 'cil-user'},
  },
  {
    name: 'New Post',
    url: '/user/add-post',
    iconComponent: {name: 'cil-pencil'},
  },
  {
    name: 'Timeline',
    url: '/user/timeline',
    iconComponent: {name: 'cil-list'},
    badge: {
      color: 'success',
      text: 'HOT',
    },
  },
  {
    name: 'Conges',
    url: '/user/conges',
    iconComponent: {name: 'cil-calendar'},
    badge: {
      color: 'success',
      text: 'HOT',
    },
  },
  {
    name: 'Chat',
    url: '/user/chat',
    linkProps: {fragment: 'headings'},
    iconComponent: {name: 'cil-speech'},
  },
    {
    name: 'Absences',
    url: '/user/absences-notifications',
    linkProps: {fragment: 'headings'},
    iconComponent: {name: 'cil-bell'},
  },

];

export const navItemsAdmin: INavData[] = [
  ...commonNavItems.slice(0, 1),
  {
    title: true,
    name: 'Mangement USERS',
  },
  {
    name: 'Create Employee',
    url: '/user/add-user',
    iconComponent: {name: 'cil-user-follow'},
  },
  {
    name: 'Liste of Employees',
    url: '/user/user-list',
    linkProps: {fragment: 'headings'},
    iconComponent: {name: 'cil-people'},
  },
  {
    name: 'Absences Management',
    url: '/user/absences',
    linkProps: {fragment: 'headings'},
    iconComponent: {name: 'cil-task'},
  },
  ...commonNavItems.slice(1),
];

export const navItemsUser: INavData[] = [
  ...commonNavItems
];
