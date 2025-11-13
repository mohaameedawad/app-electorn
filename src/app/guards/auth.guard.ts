import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
      // User is logged in
      return true;
    }

    // User is not logged in, redirect to login
    this.router.navigate(['/login']);
    return false;
  }
}
