import { Permission } from './permissions.enum';

export interface User {
  id?: number;
  username: string;
  password: string;
  fullName: string;
  role: 'admin' | 'accountant' | 'user';
  isActive: boolean;
  permissions?: Permission[];
}

export type UserRole = 'admin' | 'accountant' | 'user';

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'مدير النظام',
  accountant: 'محاسب',
  user: 'بائع'
};
