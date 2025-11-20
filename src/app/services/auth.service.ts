import { Injectable } from '@angular/core';
import { Permission } from '../models/permissions.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: any = null;

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  login(user: any) {
    try {
      // Create a completely clean object with explicit property extraction
      const cleanUser = {
        id: user.id,
        fullName: user.fullName,
        isActive: user.isActive,
        password: user.password,
        permissions: Array.isArray(user.permissions) ? [...user.permissions] : [],
        role: user.role,
        username: user.username
      };
      
      // Double sanitize by stringifying and parsing
      const sanitizedUser = JSON.parse(JSON.stringify(cleanUser));
      
      this.currentUser = sanitizedUser;
      
      // Try to store in localStorage
      const userString = JSON.stringify(sanitizedUser);
      console.log('Sanitized user string:', userString);
      localStorage.setItem('currentUser', userString);
      console.log('Login successful');
    } catch (error) {
      console.error('Error in login method:', error);
      throw error;
    }
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  getUserRole(): string {
    return this.currentUser?.role || '';
  }

  hasPermission(page: string): boolean {
    // If user has custom permissions, use them
    if (this.currentUser?.permissions && this.currentUser.permissions.length > 0) {
      return this.currentUser.permissions.includes(page);
    }
    // Otherwise, use role-based permissions
    const role = this.getUserRole();
    const permissions = this.getRolePermissions(role);
    return permissions.includes(page);
  }

  getRolePermissions(role: string): string[] {
    const permissionsMap: { [key: string]: string[] } = {
      'admin': [
        Permission.DASHBOARD,
        Permission.SALES,
        Permission.PURCHASES,
        Permission.CUSTOMERS,
        Permission.SUPPLIERS,
        Permission.PRODUCTS,
        Permission.EMPLOYEES,
        Permission.CUSTOMERS_PAYMENTS,
        Permission.EXPENSES,
        Permission.REPORTS,
        Permission.USERS
      ],
      'accountant': [
        Permission.DASHBOARD,
        Permission.SALES,
        Permission.PURCHASES,
        Permission.CUSTOMERS,
        Permission.SUPPLIERS,
        Permission.CUSTOMERS_PAYMENTS,
        Permission.EXPENSES,
        Permission.REPORTS
      ],
      'user': [
        Permission.DASHBOARD,
        Permission.SALES,
        Permission.CUSTOMERS,
        Permission.PRODUCTS
      ]
    };

    // If the role exists in the map, return its permissions
    if (permissionsMap[role]) {
      return permissionsMap[role];
    }
    if (this.currentUser?.role === role && Array.isArray(this.currentUser.permissions)) {
      return this.currentUser.permissions;
    }
    return [];
  }

  getAvailablePages() {
    // If user has custom permissions, use them
    if (this.currentUser?.permissions && this.currentUser.permissions.length > 0) {
      return this.currentUser.permissions;
    }
    
    // Otherwise, use role-based permissions
    const role = this.getUserRole();
    return this.getRolePermissions(role);
  }
}