import { provideRouter, Routes } from '@angular/router';
import { PassphraseComponent } from './pages/passphrase/passphrase.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './auth.guard';
import { OrderComponent } from './pages/order/order.component';

export const routes: Routes = [
  {
    path: '',
    component: OrderComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'pass',
    component: PassphraseComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard], // Protect order route with AuthGuard
  },
];
