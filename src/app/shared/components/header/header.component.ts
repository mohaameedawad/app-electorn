import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userName: string = 'المستخدم';

  constructor(private router: Router) {
    // Get user from localStorage if exists
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this.userName = user.name || 'المستخدم';
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
