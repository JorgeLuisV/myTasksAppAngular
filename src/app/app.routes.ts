import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';
import { redirectGuard } from './guards/redirect.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [redirectGuard],
    loadComponent: () =>
      import('./modules/auth/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/home/pages/home/home.component').then(
        (m) => m.HomeComponent
      ),
  },
];
