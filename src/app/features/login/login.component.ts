import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { PasswordModule } from 'primeng/password';
import { AuthCardComponent } from '../../shared/components/auth-card/auth-card.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, RouterLink, PasswordModule, AuthCardComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
    
  constructor(
    private router: Router,
    private authService: AuthService,
    private dbService: DatabaseService
  ) {}

  ngOnInit() {
    // Always clear any existing session when visiting login page
    this.authService.logout();
  }

  async login() {
    this.errorMessage = '';

    if (!this.username || !this.password) {
      this.errorMessage = 'الرجاء إدخال اسم المستخدم وكلمة المرور';
      return;
    }

    try {
      const usersData = await this.dbService.getUsers();
      console.log('Raw users data from DB:', usersData);
      
      // Sanitize the data received from Electron IPC
      // This converts it to a plain JSON object and back to remove prototypes
      const users = JSON.parse(JSON.stringify(usersData));
      console.log('Sanitized users:', users);

      const user = users.find((u: any) => 
        u.username === this.username && u.password === this.password
      );

      if (user) {
        if (!user.isActive) {
          this.errorMessage = 'الحساب غير مفعل يرجى التواصل مع ال admin من فضلك';
          return;
        }
        
        console.log('Found user, attempting login...');
        // Login successful - pass the sanitized user
        this.authService.login(user);
        console.log('Login method completed, navigating...');
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'اسم المستخدم أو كلمة المرور غير صحيحة';
      }
    } catch (error) {
      console.error('Login error:', error);
      this.errorMessage = 'حدث خطأ أثناء تسجيل الدخول: ' + (error as Error).message;
    }
  }
}