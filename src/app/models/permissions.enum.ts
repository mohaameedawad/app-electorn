export enum Permission {
  DASHBOARD = 'dashboard',
  SALES = 'sales',
  PURCHASES = 'purchases',
  CUSTOMERS = 'customers',
  SUPPLIERS = 'suppliers',
  PRODUCTS = 'products',
  EMPLOYEES = 'employees',
  CUSTOMERS_PAYMENTS = 'customers_payments',
  EXPENSES = 'expenses',
  USERS = 'users',
  REPORTS = 'reports'
}

export const ALL_PERMISSIONS = Object.values(Permission);

export const PERMISSION_LABELS: Record<Permission, string> = {
  [Permission.DASHBOARD]: 'لوحة التحكم',
  [Permission.SALES]: 'فواتير البيع',
  [Permission.PURCHASES]: 'فواتير المشتريات',
  [Permission.CUSTOMERS]: 'العملاء',
  [Permission.SUPPLIERS]: 'الموردين',
  [Permission.PRODUCTS]: 'المنتجات',
  [Permission.EMPLOYEES]: 'الموظفين',
  [Permission.CUSTOMERS_PAYMENTS]: 'دفعات العملاء',
  [Permission.EXPENSES]: 'المصروفات',
  [Permission.USERS]: 'إدارة المستخدمين',
  [Permission.REPORTS]: 'التقارير'
};
