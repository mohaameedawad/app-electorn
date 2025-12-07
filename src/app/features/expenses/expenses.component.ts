import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { DatabaseService } from '../../services/database.service';
import { TableComponent } from '../../shared/components/table/table.component';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { TableModule } from 'primeng/table';

interface Expense {
  id?: number;
  voucherNumber: string;
  expenseType: string;
  date: Date;
  amount: number;
  employeeId?: number;
  fixedSalary?: number;
  deduction?: number;
  employeeSales?: {
    productName: string;
    quantity: number;
    commission: number;
    total: number;
  }[];
}

interface Employee {
  id: number;
  name: string;
  sales: { productName: string; quantity: number }[];
}

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    DatePickerModule,
    TableComponent,
    ButtonModule,
    CalendarModule,
    DialogComponent,
    ConfirmationDialogComponent,
    InputNumberModule,
    TableModule,
  ],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
})
export class ExpensesComponent implements OnInit {
  @ViewChild(ConfirmationDialogComponent)
  confirmDialog!: ConfirmationDialogComponent;

  expenses: Expense[] = [];
  monthlySales: any[] = [];

  displayDialog = false;
  expense: Expense = this.getEmptyExpense();
  isEditMode = false;

  employees: Employee[] = [];
  fixedSalary: number = 0;
  deduction: number = 0;
  employeeSales: any[] = [];
  totalSalary: number = 0;

  expenseTypes = [
    { label: 'القبض', value: 'القبض' },
    { label: 'نقل', value: 'نقل' },
    { label: 'إيجار', value: 'إيجار' },
    { label: 'إكرامية', value: 'إكرامية' },
    { label: 'فواتير مياه وكهرباء وغاز', value: 'فواتير مياه وكهرباء وغاز' },
  ];

  columns = [
    { field: 'voucherNumber', header: 'رقم السند الصرف' },
    { field: 'expenseType', header: 'نوع المصروف' },
    { field: 'date', header: 'التاريخ', type: 'date' },
    {
      field: 'amount',
      header: 'المبلغ',
      valueGetter: (row: Expense) => {
        if (row.expenseType === 'القبض') {
          const fixedSalary = Number(row.fixedSalary) || 0;
          const deduction = Number(row.deduction) || 0;
          const commissionTotal = Array.isArray(row.employeeSales)
            ? row.employeeSales.reduce(
                (sum, item) => sum + (Number(item.total) || 0),
                0
              )
            : 0;
          return fixedSalary + commissionTotal - deduction;
        }
        return row.amount;
      },
    },
    {
      field: 'actions',
      header: 'الإجراءات',
      type: 'actions',
      actions: ['edit', 'delete'],
    },
  ];

  constructor(private dbService: DatabaseService) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    this.expenses = await this.dbService.getExpenses();
    this.employees = await this.dbService.getEmployees();
  }

  getEmptyExpense(): Expense {
    return {
      voucherNumber: this.generateVoucherNumber(),
      expenseType: '',
      date: new Date(),
      amount: 0,
      employeeId: undefined,
      fixedSalary: 0,
      deduction: 0,
      employeeSales: [],
    };
  }

  generateVoucherNumber(): string {
    const maxId =
      this.expenses.length > 0
        ? Math.max(...this.expenses.map((x) => x.id || 0))
        : 0;
    return String(maxId + 1);
  }

  async showAddDialog() {
    this.expense = this.getEmptyExpense();
    this.isEditMode = false;

    this.expense.employeeId = undefined;
    this.fixedSalary = 0;
    this.deduction = 0;
    this.totalSalary = 0;
    this.employeeSales = [];
    this.expense.amount = 0;

    this.displayDialog = true;
  }

  async editExpense(expense: Expense) {
    this.expense = {
      ...expense,
      date: new Date(expense.date),
      amount: expense.amount,
    };
    if (expense.employeeId) {
      this.fixedSalary = expense.fixedSalary || 0;
      this.deduction = expense.deduction || 0;

      if (expense.employeeSales) {
        this.employeeSales = expense.employeeSales.map((x) => ({ ...x }));
      } else {
        this.employeeSales = await this.dbService.getEmployeeSales(
          expense.employeeId
        );
        this.employeeSales = this.employeeSales.map((item) => ({
          ...item,
          commission: 0,
          total: 0,
        }));
      }

      this.updateTotals();
    }

    this.isEditMode = true;
    this.displayDialog = true;
  }

  async deleteExpense(expense: Expense) {
    if (!this.confirmDialog) return;

    this.confirmDialog.show({
      message: `هل أنت متأكد من حذف سند الصرف رقم "${expense.voucherNumber}"؟`,
      header: 'تأكيد الحذف',
      acceptLabel: 'حذف',
      rejectLabel: 'إلغاء',
      accept: async () => {
        await this.dbService.deleteExpense(expense.id!);
        await this.loadData();
      },
    });
  }

  async onEmployeeSelected() {
    if (!this.expense.employeeId) return;

    this.fixedSalary = 0;
    this.deduction = 0;
    this.totalSalary = 0;
    const sales = await this.dbService.getEmployeeSales(
      this.expense.employeeId!
    );

    this.employeeSales = sales.map((s: any) => ({
      ...s,
      commission: 0,
      total: 0,
    }));

    this.updateTotals();
  }

  updateTotals() {
    if (this.expense.expenseType !== 'القبض') return;
    let commissionSum = 0;

    this.employeeSales.forEach((item) => {
      const c = Number(item.commission) || 0;
      item.total = c * item.quantity;
      commissionSum += item.total;
    });

    const salary = Number(this.fixedSalary) || 0;

    this.totalSalary = salary + commissionSum - this.deduction;
    this.expense.fixedSalary = this.fixedSalary;
    this.expense.deduction = this.deduction;
    this.expense.employeeSales = this.employeeSales;
  }

  async saveExpense() {
    switch (this.expense.expenseType) {
      case 'القبض':
      if (this.fixedSalary === 0) return;
      this.expense.amount = this.getAmount();
      break;
      default:
      if (this.expense.amount <= 0) return;
      break;
    }

    const action = this.isEditMode
      ? this.dbService.updateExpense(this.expense.id!, this.expense)
      : this.dbService.addExpense(this.expense);

    await action;
    this.displayDialog = false;
    await this.loadData();
  }

  hideDialog() {
    this.displayDialog = false;
  }

  onExpenseTypeChange() {
    this.expense.employeeId = undefined;
    this.fixedSalary = 0;
    this.deduction = 0;
    this.employeeSales = [];
    this.totalSalary = 0;
    this.expense.amount = 0;
  }

  getAmount(): number {
    if (this.expense.expenseType === 'القبض') {
      const commissionTotal = this.employeeSales.reduce(
        (sum, item) => sum + (item.total || 0),
        0
      );
      return (
        (Number(this.fixedSalary) || 0) +
        commissionTotal -
        (Number(this.deduction) || 0)
      );
    }
    return Number(this.expense.amount) || 0;
  }
}
