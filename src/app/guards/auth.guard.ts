import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      // User is not logged in, redirect to login
      this.router.navigate(['/login']);
      return false;
    }

    // Get the page name from the route path
    const path = route.routeConfig?.path || '';
    
    // Check if user has permission to access this page
    if (path && !this.authService.hasPermission(path)) {
      // User doesn't have permission, redirect to dashboard
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}
