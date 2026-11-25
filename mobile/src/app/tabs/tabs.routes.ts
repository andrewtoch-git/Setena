import type { Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      { path: 'explorar', loadComponent: () => import('../pages/explorar/explorar.page').then((m) => m.ExplorarPage) },
      {
        path: 'favoritos',
        loadComponent: () => import('../pages/favoritos/favoritos.page').then((m) => m.FavoritosPage),
      },
      { path: 'chats', loadComponent: () => import('../pages/chats/chats.page').then((m) => m.ChatsPage) },
      {
        path: 'mi-perfil',
        loadComponent: () => import('../pages/mi-perfil/mi-perfil.page').then((m) => m.MiPerfilPage),
      },
      { path: '', redirectTo: '/tabs/explorar', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/tabs/explorar', pathMatch: 'full' },
];
