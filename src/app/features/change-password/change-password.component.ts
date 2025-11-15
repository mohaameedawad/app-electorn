import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  currentUser: any;

  constructor(
    private router: Router,
    private dbService: DatabaseService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
  }

  async changePassword() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'الرجاء ملء جميع الحقول';
      return;
    }

    if (this.currentPassword !== this.currentUser.password) {
      this.errorMessage = 'كلمة المرور الحالية غير صحيحة';
      return;
    }

    if (this.newPassword.length < 4) {
      this.errorMessage = 'كلمة المرور الجديدة يجب أن تكون 4 أحرف على الأقل';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'كلمة المرور الجديدة وتأكيدها غير متطابقين';
      return;
    }

    if (this.newPassword === this.currentPassword) {
      this.errorMessage = 'كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية';
      return;
    }

    try {
      await this.dbService.updateUser(this.currentUser.id, { password: this.newPassword });
      
      // Update current user in localStorage
      this.currentUser.password = this.newPassword;
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

      this.successMessage = 'تم تغيير كلمة المرور بنجاح';
      
      // Clear form
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';

      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      this.errorMessage = 'حدث خطأ أثناء تغيير كلمة المرور';
    }
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }
}
