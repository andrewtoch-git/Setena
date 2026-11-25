import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'perfil/:id',
    loadComponent: () => import('./pages/perfil/perfil.page').then((m) => m.PerfilPage),
  },
  {
    path: 'iniciar-sesion',
    loadComponent: () => import('./pages/iniciar-sesion/iniciar-sesion.page').then((m) => m.IniciarSesionPage),
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.page').then((m) => m.RegistroPage),
  },
  {
    path: 'bienvenida',
    loadComponent: () => import('./pages/bienvenida/bienvenida.page').then((m) => m.BienvenidaPage),
  },
  {
    path: 'chat/:id',
    loadComponent: () => import('./pages/chat/chat.page').then((m) => m.ChatPage),
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
];
