import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';
import { Permission, PERMISSION_LABELS } from '../../models/permissions.enum';
import { User, ROLE_LABELS } from '../../models/user.interface';
import { TableComponent } from '../../shared/components/table/table.component';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { PasswordModule } from 'primeng/password';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    CheckboxModule,
    TableComponent,
    DialogComponent,
    PasswordModule,
    ConfirmationDialogComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  @ViewChild(ConfirmationDialogComponent)
  confirmDialog!: ConfirmationDialogComponent;

  users: User[] = [];
  displayDialog = false;
  user: User = this.getEmptyUser();
  isEditMode = false;

  availablePages = Object.values(Permission).map((permission) => ({
    name: permission,
    label: PERMISSION_LABELS[permission as Permission],
  }));

  roles = [
    { label: ROLE_LABELS.admin, value: 'admin' },
    { label: ROLE_LABELS.accountant, value: 'accountant' },
    { label: ROLE_LABELS.user, value: 'user' },
  ];

  statusOptions = [
    { label: 'نشط', value: true },
    { label: 'غير نشط', value: false },
  ];

  columns = [
    { field: 'username', header: 'اسم المستخدم' },
    { field: 'fullName', header: 'الاسم الكامل' },
    { field: 'role', header: 'الصلاحية' },
    { field: 'isActive', header: 'الحالة' },
    {
      field: 'actions',
      header: 'الإجراءات',
      type: 'actions',
      actions: ['edit', 'delete'],
    },
  ];

  constructor(
    private dbService: DatabaseService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    try {
      this.users = await this.dbService.getAllUsers();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  getEmptyUser(): User {
    return {
      username: '',
      password: '',
      fullName: '',
      role: 'user',
      isActive: true,
      permissions: [],
    };
  }

  onRoleChange() {
    this.user.permissions = this.authService
      .getRolePermissions(this.user.role)
      .map((p) => p as Permission);
  }

  togglePermission(page: Permission) {
    if (!this.user.permissions) {
      this.user.permissions = [];
    }

    const index = this.user.permissions.indexOf(page);
    if (index > -1) {
      this.user.permissions.splice(index, 1);
    } else {
      this.user.permissions.push(page);
    }
  }

  hasPermission(page: Permission): boolean {
    return this.user.permissions?.includes(page) || false;
  }

  showAddDialog() {
    // Initialize permissions as empty array so all checkboxes are unchecked
    const emptyUser = this.getEmptyUser();
    emptyUser.permissions = [];
    this.user = emptyUser;
    this.isEditMode = false;
    this.displayDialog = true;
  }

  editUser(user: User) {
    let permissions: Permission[] = [];
    if (Array.isArray(user.permissions) && user.permissions.length > 0) {
      permissions = user.permissions as Permission[];
    } else {
      permissions = this.authService
        .getRolePermissions(user.role)
        .map((p) => p as Permission);
    }
    this.user = { ...user, permissions };
    this.isEditMode = true;
    this.displayDialog = true;
  }

  async deleteUser(user: User) {
    this.confirmDialog.show({
      message: `هل أنت متأكد من حذف المستخدم "${user.fullName}"؟`,
      header: 'تأكيد الحذف',
      acceptLabel: 'حذف',
      rejectLabel: 'إلغاء',
      accept: async () => {
        try {
          await this.dbService.deleteUser(user.id!);
          await this.loadData();
        } catch (error) {
          console.error('Error deleting user:', error);
        }
      },
    });
  }

  async saveUser() {
    try {
      if (this.isEditMode) {
        await this.dbService.updateUser(this.user.id!, this.user);
      } else {
        await this.dbService.addUser(this.user);
      }
      this.displayDialog = false;
      await this.loadData();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }

  hideDialog() {
    this.displayDialog = false;
  }

  getRoleLabel(role: string): string {
    return ROLE_LABELS[role as keyof typeof ROLE_LABELS] || role;
  }

  getStatusLabel(isActive: boolean): string {
    return isActive ? 'نشط' : 'غير نشط';
  }
}
