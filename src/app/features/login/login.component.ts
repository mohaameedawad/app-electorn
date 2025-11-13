import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // Always clear any existing session when visiting login page
    localStorage.removeItem('currentUser');
  }

  login() {
    this.errorMessage = '';

    if (!this.username || !this.password) {
      this.errorMessage = 'الرجاء إدخال اسم المستخدم وكلمة المرور';
      return;
    }

    // Simple authentication (في الواقع، يجب استخدام API للمصادقة)
    if (this.username === 'admin' && this.password === 'admin') {
      const user = {
        name: this.username,
        role: 'admin'
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'اسم المستخدم أو كلمة المرور غير صحيحة';
    }
  }
}
