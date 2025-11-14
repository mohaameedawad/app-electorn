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
import { PaymentsComponent } from './features/payments/payments.component';
import { ExpensesComponent } from './features/expenses/expenses.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'sales', component: SalesComponent, canActivate: [AuthGuard] },
  { path: 'purchases', component: PurchasesComponent, canActivate: [AuthGuard] },
  { path: 'customers', component: CustomersComponent, canActivate: [AuthGuard] },
  { path: 'suppliers', component: SuppliersComponent, canActivate: [AuthGuard] },
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
  { path: 'employees', component: EmployeesComponent, canActivate: [AuthGuard] },
  { path: 'payments', component: PaymentsComponent, canActivate: [AuthGuard] },
  { path: 'expenses', component: ExpensesComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
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
