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
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' } // Redirect any unknown route to login
];
