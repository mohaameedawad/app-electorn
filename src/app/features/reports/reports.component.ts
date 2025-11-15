import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '../../shared/components/table/table.component';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { DatabaseService } from '../../services/database.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableComponent,
    DialogModule,
    SelectModule,
    DatePickerModule,
    ButtonModule,
    DialogComponent
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent implements OnInit {
  displayExpensesDialog = false;
  displayCustomerDialog = false;
  displaySupplierDialog = false;
  displayPaymentsDialog = false;
  displayPurchasesDialog = false;
  displayProfitsDialog = false;

  customers: any[] = [];
  suppliers: any[] = [];
  expenses: any[] = [];
  payments: any[] = [];
  purchases: any[] = [];
  sales: any[] = [];

  selectedCustomer: any = null;
  selectedSupplier: any = null;
  dateFrom: Date = new Date();
  dateTo: Date = new Date();

  expensesData: any[] = [];
  customerStatementData: any[] = [];
  supplierStatementData: any[] = [];
  paymentsData: any[] = [];
  purchasesData: any[] = [];
  profitsData: any[] = [];

  expensesColumns = [
    { field: 'voucherNumber', header: 'رقم السند' },
    { field: 'expenseType', header: 'نوع المصروف' },
    { field: 'date', header: 'التاريخ', type: 'date' },
    { field: 'amount', header: 'المبلغ' },
  ];

  customerStatementColumns = [
    { field: 'date', header: 'التاريخ', type: 'date' },
    { field: 'type', header: 'النوع' },
    { field: 'invoiceNumber', header: 'رقم الفاتورة' },
    { field: 'amount', header: 'المبلغ' },
    { field: 'balance', header: 'الرصيد' },
  ];

  supplierStatementColumns = [
    { field: 'date', header: 'التاريخ', type: 'date' },
    { field: 'type', header: 'النوع' },
    { field: 'invoiceNumber', header: 'رقم الفاتورة' },
    { field: 'amount', header: 'المبلغ' },
    { field: 'balance', header: 'الرصيد' },
  ];

  paymentsColumns = [
    { field: 'receiptNumber', header: 'رقم سند القبض' },
    { field: 'customerName', header: 'اسم العميل' },
    { field: 'date', header: 'التاريخ', type: 'date' },
    { field: 'amount', header: 'المبلغ' },
  ];

  purchasesColumns = [
    { field: 'invoiceNumber', header: 'رقم الفاتورة' },
    { field: 'supplierName', header: 'اسم المورد' },
    { field: 'date', header: 'التاريخ', type: 'date' },
    { field: 'totalAmount', header: 'إجمالي المبلغ' },
  ];

  profitsColumns = [
    { field: 'month', header: 'الشهر' },
    { field: 'totalSales', header: 'إجمالي المبيعات' },
    { field: 'totalPurchases', header: 'إجمالي المشتريات' },
    { field: 'totalExpenses', header: 'إجمالي المصروفات' },
    { field: 'profit', header: 'صافي الربح' },
  ];

  constructor(private dbService: DatabaseService) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    try {
      this.customers = await this.dbService.getCustomers();
      this.suppliers = await this.dbService.getSuppliers();
      this.expenses = await this.dbService.getExpenses();
      this.payments = await this.dbService.getPayments();
      this.purchases = await this.dbService.getPurchases();
      this.sales = await this.dbService.getSales();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  showExpensesReport() {
    this.displayExpensesDialog = true;
    this.generateExpensesReport();
  }

  showCustomerStatement() {
    this.displayCustomerDialog = true;
    this.selectedCustomer = null;
    this.customerStatementData = [];
  }

  showSupplierStatement() {
    this.displaySupplierDialog = true;
    this.selectedSupplier = null;
    this.supplierStatementData = [];
  }

  generateExpensesReport() {
    const filtered = this.expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= this.dateFrom && expenseDate <= this.dateTo;
    });
    this.expensesData = filtered;
  }

  async generateCustomerStatement() {
    if (!this.selectedCustomer) return;

    try {
      const sales = await this.dbService.getSales();
      const payments = await this.dbService.getPayments();

      const customerSales = sales.filter(
        (s: any) => s.customerName === this.selectedCustomer.name
      );
      const customerPayments = payments.filter(
        (p: any) => p.customerName === this.selectedCustomer.name
      );

      const transactions: any[] = [];

      customerSales.forEach((sale: any) => {
        transactions.push({
          date: new Date(sale.date),
          type: 'فاتورة بيع',
          invoiceNumber: sale.invoiceNumber,
          amount: sale.totalAmount,
          isDebit: true,
        });
      });

      customerPayments.forEach((payment: any) => {
        transactions.push({
          date: new Date(payment.date),
          type: 'سند قبض',
          invoiceNumber: payment.receiptNumber,
          amount: payment.amount,
          isDebit: false,
        });
      });

      transactions.sort((a, b) => a.date.getTime() - b.date.getTime());

      let balance = 0;
      this.customerStatementData = transactions.map((t) => {
        balance += t.isDebit ? t.amount : -t.amount;
        return {
          date: t.date,
          type: t.type,
          invoiceNumber: t.invoiceNumber,
          amount: t.amount,
          balance: balance,
        };
      });
    } catch (error) {
      console.error('Error generating customer statement:', error);
    }
  }

  async generateSupplierStatement() {
    if (!this.selectedSupplier) return;

    try {
      const purchases = await this.dbService.getPurchases();

      const supplierPurchases = purchases.filter(
        (p: any) => p.supplierName === this.selectedSupplier.name
      );

      const transactions: any[] = [];

      supplierPurchases.forEach((purchase: any) => {
        transactions.push({
          date: new Date(purchase.date),
          type: 'فاتورة شراء',
          invoiceNumber: purchase.invoiceNumber,
          amount: purchase.totalAmount,
          isDebit: true,
        });
      });

      transactions.sort((a, b) => a.date.getTime() - b.date.getTime());

      let balance = 0;
      this.supplierStatementData = transactions.map((t) => {
        balance += t.isDebit ? t.amount : -t.amount;
        return {
          date: t.date,
          type: t.type,
          invoiceNumber: t.invoiceNumber,
          amount: t.amount,
          balance: balance,
        };
      });
    } catch (error) {
      console.error('Error generating supplier statement:', error);
    }
  }

  showPaymentsReport() {
    this.displayPaymentsDialog = true;
    this.generatePaymentsReport();
  }

  generatePaymentsReport() {
    const filtered = this.payments.filter((payment: any) => {
      const paymentDate = new Date(payment.date);
      return paymentDate >= this.dateFrom && paymentDate <= this.dateTo;
    });
    this.paymentsData = filtered;
  }

  showPurchasesReport() {
    this.displayPurchasesDialog = true;
    this.generatePurchasesReport();
  }

  generatePurchasesReport() {
    const filtered = this.purchases.filter((purchase: any) => {
      const purchaseDate = new Date(purchase.date);
      return purchaseDate >= this.dateFrom && purchaseDate <= this.dateTo;
    });
    this.purchasesData = filtered;
  }

  showProfitsReport() {
    this.displayProfitsDialog = true;
    this.generateProfitsReport();
  }

  generateProfitsReport() {
    const monthsData = new Map<string, any>();

    // Process sales
    this.sales.forEach((sale: any) => {
      const date = new Date(sale.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;

      if (!monthsData.has(monthKey)) {
        monthsData.set(monthKey, {
          month:
            this.getMonthName(date.getMonth() + 1) + ' ' + date.getFullYear(),
          totalSales: 0,
          totalPurchases: 0,
          totalExpenses: 0,
          profit: 0,
        });
      }

      monthsData.get(monthKey).totalSales += sale.totalAmount || 0;
    });

    // Process purchases
    this.purchases.forEach((purchase: any) => {
      const date = new Date(purchase.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;

      if (!monthsData.has(monthKey)) {
        monthsData.set(monthKey, {
          month:
            this.getMonthName(date.getMonth() + 1) + ' ' + date.getFullYear(),
          totalSales: 0,
          totalPurchases: 0,
          totalExpenses: 0,
          profit: 0,
        });
      }

      monthsData.get(monthKey).totalPurchases += purchase.totalAmount || 0;
    });

    // Process expenses
    this.expenses.forEach((expense: any) => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;

      if (!monthsData.has(monthKey)) {
        monthsData.set(monthKey, {
          month:
            this.getMonthName(date.getMonth() + 1) + ' ' + date.getFullYear(),
          totalSales: 0,
          totalPurchases: 0,
          totalExpenses: 0,
          profit: 0,
        });
      }

      monthsData.get(monthKey).totalExpenses += expense.amount || 0;
    });

    // Calculate profit for each month
    monthsData.forEach((data) => {
      data.profit = data.totalSales - data.totalPurchases - data.totalExpenses;
    });

    this.profitsData = Array.from(monthsData.values()).sort((a, b) => {
      return b.month.localeCompare(a.month);
    });
  }

  getMonthName(month: number): string {
    const months = [
      'يناير',
      'فبراير',
      'مارس',
      'أبريل',
      'مايو',
      'يونيو',
      'يوليو',
      'أغسطس',
      'سبتمبر',
      'أكتوبر',
      'نوفمبر',
      'ديسمبر',
    ];
    return months[month - 1];
  }
}
