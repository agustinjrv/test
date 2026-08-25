import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth-guard';
import { Home } from './home/home';
import { Login } from './login/login';
import { Train } from './train/train';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'train', component: Train, canActivate: [authGuard] },
  { path: 'train/:dayId', component: Train, canActivate: [authGuard] },
  { path: 'train/:dayId/:exerciseId', component: Train, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];
