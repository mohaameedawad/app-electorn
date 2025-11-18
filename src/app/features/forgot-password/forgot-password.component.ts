import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DatabaseService } from '../../services/database.service';
import { AuthCardComponent } from '../../shared/components/auth-card/auth-card.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule , AuthCardComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  username: string = '';
  fullName: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  step: number = 1; // 1: verify user, 2: reset password

  constructor(private router: Router, private dbService: DatabaseService) {}

  async verifyUser() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.username || !this.fullName) {
      this.errorMessage = 'الرجاء إدخال اسم المستخدم والاسم الكامل';
      return;
    }

    try {
      const users = await this.dbService.getAllUsers();
      const user = users.find((u: any) => 
        u.username === this.username && u.fullName === this.fullName
      );

      if (user) {
        this.step = 2;
        this.successMessage = 'تم التحقق بنجاح. يمكنك الآن إدخال كلمة المرور الجديدة';
      } else {
        this.errorMessage = 'اسم المستخدم أو الاسم الكامل غير صحيح';
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      this.errorMessage = 'حدث خطأ أثناء التحقق';
    }
  }

  async resetPassword() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'الرجاء إدخال كلمة المرور الجديدة وتأكيدها';
      return;
    }

    if (this.newPassword.length < 4) {
      this.errorMessage = 'كلمة المرور يجب أن تكون 4 أحرف على الأقل';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'كلمة المرور وتأكيدها غير متطابقين';
      return;
    }

    try {
      const users = await this.dbService.getAllUsers();
      const user = users.find((u: any) => u.username === this.username);

      if (user) {
        await this.dbService.updateUser(user.id, { password: this.newPassword });
        this.successMessage = 'تم تغيير كلمة المرور بنجاح';
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      this.errorMessage = 'حدث خطأ أثناء تغيير كلمة المرور';
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
