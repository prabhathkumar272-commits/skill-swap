import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'auth', loadComponent: () => import('./pages/auth/auth.component').then(m => m.AuthComponent) },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard] },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
  { path: 'matches', loadComponent: () => import('./pages/matches/matches.component').then(m => m.MatchesComponent), canActivate: [authGuard] },
  { path: 'requests', loadComponent: () => import('./pages/requests/requests.component').then(m => m.RequestsComponent), canActivate: [authGuard] },
  { path: 'sessions', loadComponent: () => import('./pages/sessions/sessions.component').then(m => m.SessionsComponent), canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
