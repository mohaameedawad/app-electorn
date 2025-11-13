import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private router: Router) {}

  handleError(error: any): void {
    console.error('Global error handler:', error);
    
    // Clear user session on critical errors
    localStorage.removeItem('currentUser');
    
    // Redirect to login
    this.router.navigate(['/login']);
  }
}
