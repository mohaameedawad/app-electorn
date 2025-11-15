import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem, MessageService } from 'primeng/api';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, SplitButtonModule, TieredMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  userName: string = 'المستخدم';
  pageTitle: string = 'لوحة التحكم';

  items = [
    {
      label: 'تغيير كلمة المرور',
      icon: 'pi pi-key',
      command: () => this.changePassword()
    },
    {
      separator: true
    },
    {
      label: 'تسجيل الخروج',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.fullName || user.username || 'المستخدم';
    }
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        map(route => route.snapshot.data['title'] || '')
      )
      .subscribe(title => {
        this.pageTitle = title;
      });
  }

  changePassword() {
    this.router.navigate(['/change-password']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}