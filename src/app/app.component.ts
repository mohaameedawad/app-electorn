import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';
import { Permission } from './models/permissions.enum';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'app-electron';
  showLayout = false;
  // showLayout = true;

  allNavItems = [
    { path: '/dashboard', icon: 'pi-home', label: 'لوحة التحكم', page: Permission.DASHBOARD },
    { path: '/sales', icon: 'pi-shopping-cart', label: 'فواتير البيع', page: Permission.SALES },
    { path: '/purchases', icon: 'pi-shopping-bag', label: 'فواتير المشتريات', page: Permission.PURCHASES },
    { path: '/customers', icon: 'pi-users', label: 'العملاء', page: Permission.CUSTOMERS },
    { path: '/suppliers', icon: 'pi-truck', label: 'الموردين', page: Permission.SUPPLIERS },
    { path: '/products', icon: 'pi-box', label: 'المنتجات', page: Permission.PRODUCTS },
    { path: '/employees', icon: 'pi-id-card', label: 'الموظفين', page: Permission.EMPLOYEES },
    { path: '/payments', icon: 'pi-money-bill', label: 'المدفوعات', page: Permission.PAYMENTS },
    { path: '/expenses', icon: 'pi-wallet', label: 'المصروفات', page: Permission.EXPENSES },
    { path: '/users', icon: 'pi-user-edit', label: 'إدارة المستخدمين', page: Permission.USERS },
    { path: '/reports', icon: 'pi-chart-bar', label: 'التقارير', page: Permission.REPORTS }
  ];

  navItems: any[] = [];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // Check initial route
    this.checkRoute(this.router.url);
    
    // Filter nav items based on user permissions
    this.filterNavItems();
    
    // Check if current route is login on navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkRoute(event.url);
      this.filterNavItems();
    });
  }

  private checkRoute(url: string) {
    this.showLayout = !(url === '/' || url.includes('/login') || url.includes('/forgot-password') || url === '');
  }

  private filterNavItems() {
    if (this.authService.isLoggedIn()) {
      this.navItems = this.allNavItems.filter(item => 
        this.authService.hasPermission(item.page)
      );
    } else {
      this.navItems = [];
    }
  }
}
