import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'app-electron';
  showLayout = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Check initial route
    this.checkRoute(this.router.url);
    
    // Check if current route is login on navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkRoute(event.url);
    });
  }

  private checkRoute(url: string) {
    this.showLayout = !(url === '/' || url.includes('/login') || url === '');
  }
}
