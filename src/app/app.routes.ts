import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { SalesComponent } from './features/sales/sales.component';
import { PurchasesComponent } from './features/purchases/purchases.component';
import { CustomersComponent } from './features/customers/customers.component';
import { SuppliersComponent } from './features/suppliers/suppliers.component';
import { ProductsComponent } from './features/products/products.component';
import { EmployeesComponent } from './features/employees/employees.component';
import { ReportsComponent } from './features/reports/reports.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'sales', component: SalesComponent },
  { path: 'purchases', component: PurchasesComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'suppliers', component: SuppliersComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'reports', component: ReportsComponent },
];
