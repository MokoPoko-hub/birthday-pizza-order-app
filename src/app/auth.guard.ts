import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Check if 'accessGranted' exists in localStorage and if it's equal to 'true'
    const accessGranted = localStorage.getItem('accessGranted');
    const guestName = sessionStorage.getItem('guestName');

    if (accessGranted !== 'true') {
      console.log('Access not granted, redirecting to Passphrase');
      this.router.navigate(['/pass']);
      return false;
    } else if (!guestName) {
      const currentRoute = state.url;
      if (currentRoute !== '/login') {
        this.router.navigate(['/login']);
        return false;
      }
    }

    return true;
  }
}
