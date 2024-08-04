import { Routes } from '@angular/router';
import { accountGuard, authGuard } from './core/auth/guards';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './features/forgot-password/forgot-password.component';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [accountGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [accountGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [accountGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },

  {
    path: 'forgot-pass',
    component: ForgotPasswordComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
