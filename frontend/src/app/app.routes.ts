import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./components/layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then((m) => m.DashboardComponent)
      },
      {
        path: 'reportar',
        loadComponent: () =>
          import('./components/registrar-ticket/registrar-ticket.component').then((m) => m.RegistrarTicketComponent)
      },
      {
        path: 'tickets',
        loadComponent: () =>
          import('./components/listado-tickets/listado-tickets.component').then((m) => m.ListadoTicketsComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./components/usuarios/usuarios.component').then((m) => m.UsuariosComponent)
      },
      {
        path: 'usuarios/crear',
        loadComponent: () =>
          import('./components/crear-usuario/crear-usuario.component').then((m) => m.CrearUsuarioComponent)
      },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
