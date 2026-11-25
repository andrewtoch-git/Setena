import { inject } from '@angular/core';
import type { Routes } from '@angular/router';

import { SesionService } from './core/sesion.service';

export const routes: Routes = [
  {
    // Al abrir la app: Inicio sin sesión, Explorar con sesión.
    path: '',
    pathMatch: 'full',
    redirectTo: () => (inject(SesionService).iniciada() ? '/tabs/explorar' : '/inicio'),
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.page').then((m) => m.InicioPage),
  },
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
    path: 'editar-perfil',
    loadComponent: () => import('./pages/editar-perfil/editar-perfil.page').then((m) => m.EditarPerfilPage),
  },
  {
    path: 'ajustes',
    loadComponent: () => import('./pages/ajustes/ajustes.page').then((m) => m.AjustesPage),
  },
  {
    path: 'ajustes/contrasena',
    loadComponent: () => import('./pages/ajustes/cambiar-contrasena.page').then((m) => m.CambiarContrasenaPage),
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
];
