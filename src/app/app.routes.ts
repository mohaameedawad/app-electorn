import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { SalesComponent } from './features/sales/sales.component';
import { PurchasesComponent } from './features/purchases/purchases.component';
import { CustomersComponent } from './features/customers/customers.component';
import { SuppliersComponent } from './features/suppliers/suppliers.component';
import { ProductsComponent } from './features/products/products.component';
import { EmployeesComponent } from './features/employees/employees.component';
import { ReportsComponent } from './features/reports/reports.component';
import { CustomersPaymentsComponent } from './features/customers-payments/customers-payments.component';
import { ExpensesComponent } from './features/expenses/expenses.component';
import { UsersComponent } from './features/users/users.component';
import { ForgotPasswordComponent } from './features/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './features/change-password/change-password.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { title: 'لوحة التحكم' } },
  { path: 'sales', component: SalesComponent, canActivate: [AuthGuard], data: { title: 'المبيعات' } },
  { path: 'purchases', component: PurchasesComponent, canActivate: [AuthGuard], data: { title: 'المشتريات' } },
  { path: 'customers', component: CustomersComponent, canActivate: [AuthGuard], data: { title: 'العملاء' } },
  { path: 'suppliers', component: SuppliersComponent, canActivate: [AuthGuard], data: { title: 'الموردين' } },
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard], data: { title: 'المنتجات' } },
  { path: 'employees', component: EmployeesComponent, canActivate: [AuthGuard], data: { title: 'الموظفين' } },
  { path: 'customers_payments', component: CustomersPaymentsComponent, canActivate: [AuthGuard], data: { title: 'دفعات العملاء' } },
  { path: 'expenses', component: ExpensesComponent, canActivate: [AuthGuard], data: { title: 'المصروفات' } },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard], data: { title: 'إدارة المستخدمين' } },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard], data: { title: 'التقارير' } },
  { path: '**', redirectTo: 'login' } // Redirect any unknown route to login

  // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  // { path: 'login', component: LoginComponent },
  // { path: 'dashboard', component: DashboardComponent },
  // { path: 'sales', component: SalesComponent },
  // { path: 'purchases', component: PurchasesComponent },
  // { path: 'customers', component: CustomersComponent },
  // { path: 'suppliers', component: SuppliersComponent },
  // { path: 'products', component: ProductsComponent },
  // { path: 'employees', component: EmployeesComponent },
  // { path: 'reports', component: ReportsComponent },
  // { path: '**', redirectTo: 'login' } // Redirect any unknown route to login
];
