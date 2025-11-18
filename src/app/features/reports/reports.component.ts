// import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
// import { Subscription } from 'rxjs';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { TableComponent } from '../../shared/components/table/table.component';
// import { DialogModule } from 'primeng/dialog';
// import { SelectModule } from 'primeng/select';
// import { DatePickerModule } from 'primeng/datepicker';
// import { ButtonModule } from 'primeng/button';
// import { DatabaseService } from '../../services/database.service';
// import { DialogComponent } from '../../shared/components/dialog/dialog.component';
// import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';

// interface Customer {
//   name: string;
//   phone?: string;
//   id?: number;
//   [key: string]: any;
// }

// interface Supplier {
//   name: string;
//   code?: string;
//   phone?: string;
//   id?: number;
//   [key: string]: any;
// }

// @Component({
//   selector: 'app-reports',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     TableComponent,
//     DialogModule,
//     SelectModule,
//     DatePickerModule,
//     ButtonModule,
//     DialogComponent,
//     ConfirmationDialogComponent,
//   ],
//   templateUrl: './reports.component.html',
//   styleUrls: ['./reports.component.scss'],
// })
// export class ReportsComponent implements OnInit, OnDestroy {
//   private subscriptions: Subscription[] = [];
//   @ViewChild(ConfirmationDialogComponent)
//   confirmDialog!: ConfirmationDialogComponent;

//   displayReportDialog = false;
//   currentReport: string = '';

//   customers: any[] = [];
//   suppliers: any[] = [];
//   expenses: any[] = [];
//   payments: any[] = [];
//   purchases: any[] = [];
//   sales: any[] = [];
//   selectedCustomer: Customer | null = null;
//   selectedSupplier: Supplier | null = null;

//   dateFrom = new Date();
//   dateTo = new Date();

//   currentColumns: any[] = [];
//   currentData: any[] = [];

//   reportTitles: any = {
//     expenses: 'تقرير المصروفات',
//     payments: 'تقرير الدفعات',
//     purchases: 'تقرير المشتريات',
//     profits: 'تقرير الأرباح الشهرية',
//     customer: 'كشف حساب عميل',
//     supplier: 'كشف حساب مورد',
//   };

//   reportCards = [
//     { type: 'expenses', icon: 'pi pi-wallet', title: 'تقرير المصروفات', description: 'عرض جميع المصروفات' },
//     { type: 'payments', icon: 'pi pi-money-bill', title: 'تقرير الدفعات', description: 'عرض الدفعات' },
//     { type: 'purchases', icon: 'pi pi-shopping-bag', title: 'تقرير المشتريات', description: 'عرض المشتريات' },
//     { type: 'profits', icon: 'pi pi-chart-line', title: 'تقرير الأرباح الشهرية', description: 'عرض الأرباح' },
//     { type: 'customer', icon: 'pi pi-users', title: 'كشف حساب عميل', description: 'عرض حركة العميل' },
//     { type: 'supplier', icon: 'pi pi-truck', title: 'كشف حساب مورد', description: 'عرض حركة المورد' },
//   ];

//   constructor(private db: DatabaseService) {}

//   async ngOnInit() {
//     this.customers = await this.db.getCustomers();
//     this.suppliers = await this.db.getSuppliers();
//     await this.refreshAllReportsData();

//     this.subscriptions.push(
//       this.db.reportsChanged$.subscribe(() => this.refreshAllReportsData())
//     );
//   }

//   ngOnDestroy() {
//     this.subscriptions.forEach((s) => s.unsubscribe());
//   }

//   private async refreshAllReportsData() {
//     this.expenses = await this.db.getExpenses();
//     this.payments = await this.db.getPaymentsReceived();
//     this.purchases = await this.db.getAllPurchases();
//     this.sales = await this.db.getSales();
//     this.generateReport();
//   }

//   openReport(type: string) {
//     this.currentReport = type;
//     this.displayReportDialog = true;

//     if (type === 'customer') this.selectedCustomer = null;
//     if (type === 'supplier') this.selectedSupplier = null;

//     this.generateReport();
//   }

//   closeReport() {
//     this.displayReportDialog = false;
//   }

//   async generateReport() {
//     switch (this.currentReport) {
//       case 'expenses':
//         this.currentColumns = [
//           { field: 'id', header: 'رقم السند' },
//           { field: 'category', header: 'نوع المصروف' },
//           { field: 'date', header: 'التاريخ', type: 'date' },
//           { field: 'amount', header: 'المبلغ', type: 'number' },
//         ];
//         this.currentData = this.expenses.filter(
//           (e) =>
//             new Date(e.date) >= this.dateFrom &&
//             new Date(e.date) <= this.dateTo
//         );
//         break;

//       case 'payments':
//         this.currentColumns = [
//           { field: 'id', header: 'رقم السند' },
//           { field: 'customer_name', header: 'العميل' },
//           { field: 'date', header: 'التاريخ', type: 'date' },
//           { field: 'amount', header: 'المبلغ', type: 'number' },
//         ];
//         this.currentData = this.payments
//           .filter(
//             (e) =>
//               new Date(e.date) >= this.dateFrom &&
//               new Date(e.date) <= this.dateTo
//           )
//           .map((item) => ({
//             ...item,
//             customer_name:
//               this.customers.find((c) => c.id === item.customer_id)?.name ||
//               'غير معروف',
//           }));
//         break;

//       case 'purchases':
//         this.currentColumns = [
//           { field: 'id', header: 'رقم الفاتورة' },
//           { field: 'supplier_name', header: 'المورد' },
//           { field: 'purchase_date', header: 'التاريخ', type: 'date' },
//           { field: 'total', header: 'إجمالي المبلغ', type: 'number' },
//         ];
//         this.currentData = this.purchases
//           .filter(
//             (e) =>
//               new Date(e.purchase_date) >= this.dateFrom &&
//               new Date(e.purchase_date) <= this.dateTo
//           )
//           .map((item) => ({
//             ...item,
//             supplier_name:
//               this.suppliers.find((s) => s.id === item.supplier_id)?.name ||
//               'غير معروف',
//           }));
//         break;

//       case 'profits':
//         this.generateMonthlyProfits();
//         break;

//       case 'customer':
//         this.generateCustomerStatement();
//         break;

//       case 'supplier':
//         this.generateSupplierStatement();
//         break;
//     }
//   }

//   async generateCustomerStatement() {
//     if (!this.selectedCustomer) {
//       this.currentData = [];
//       return;
//     }

//     const sales = await this.db.getSales();
//     const payments = await this.db.getPaymentsReceived();

//     const result: any[] = [];

//     sales
//       .filter((s: any) => s.customer_id === this.selectedCustomer?.id)
//       .forEach((s: any) =>
//         result.push({
//           date: new Date(s.sale_date),
//           type: 'فاتورة بيع',
//           invoiceNumber: s.id,
//           debit: s.total,
//           credit: 0,
//         })
//       );

//     payments
//       .filter((p: any) => p.customer_id === this.selectedCustomer?.id)
//       .forEach((p: any) =>
//         result.push({
//           date: new Date(p.date),
//           type: 'سند قبض',
//           invoiceNumber: p.id,
//           debit: 0,
//           credit: p.amount,
//         })
//       );

//     result.sort((a, b) => a.date.getTime() - b.date.getTime());

//     let balance = 0;
//     this.currentData = result.map((t) => {
//       balance += t.debit - t.credit;
//       return {
//         date: t.date,
//         type: t.type,
//         invoiceNumber: t.invoiceNumber,
//         debit: t.debit,
//         credit: t.credit,
//         balance,
//       };
//     });

//     this.currentColumns = [
//       { field: 'date', header: 'التاريخ', type: 'date' },
//       { field: 'type', header: 'البيان' },
//       { field: 'invoiceNumber', header: 'رقم الفاتورة' },
//       { field: 'debit', header: 'مدين', type: 'number' },
//       { field: 'credit', header: 'دائن', type: 'number' },
//       { field: 'balance', header: 'الرصيد', type: 'number' },
//     ];
//   }

//   async generateSupplierStatement() {
//     if (!this.selectedSupplier) {
//       this.currentData = [];
//       return;
//     }

//     const purchases = await this.db.getAllPurchases();
//     const supplierPayments = await this.db.getSupplierPayments();

//     const result: any[] = [];

//     purchases
//       .filter((p: any) => p.supplier_id === this.selectedSupplier?.id)
//       .forEach((p: any) =>
//         result.push({
//           date: new Date(p.purchase_date),
//           type: 'فاتورة شراء',
//           invoiceNumber: p.id,
//           debit: p.total,
//           credit: 0,
//         })
//       );

//     supplierPayments
//       .filter((sp: any) => sp.supplier_id === this.selectedSupplier?.id)
//       .forEach((sp: any) =>
//         result.push({
//           date: new Date(sp.date),
//           type: 'سند صرف',
//           invoiceNumber: sp.id,
//           debit: 0,
//           credit: sp.amount,
//         })
//       );

//     result.sort((a, b) => a.date.getTime() - b.date.getTime());

//     let balance = 0;
//     this.currentData = result.map((t) => {
//       balance += t.debit - t.credit;
//       return {
//         date: t.date,
//         type: t.type,
//         invoiceNumber: t.invoiceNumber,
//         debit: t.debit,
//         credit: t.credit,
//         balance,
//       };
//     });

//     this.currentColumns = [
//       { field: 'date', header: 'التاريخ', type: 'date' },
//       { field: 'type', header: 'البيان' },
//       { field: 'debit', header: 'مدين', type: 'number' },
//       { field: 'credit', header: 'دائن', type: 'number' },
//       { field: 'balance', header: 'الرصيد', type: 'number' },
//     ];
//   }

//   generateMonthlyProfits() {
//     const map = new Map<string, any>();

//     this.sales.forEach((s) => {
//       const d = new Date(s.sale_date);
//       const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
//       if (!map.has(key))
//         map.set(key, {
//           month: this.getMonthName(d.getMonth() + 1),
//           totalSales: 0,
//           totalPurchases: 0,
//           totalExpenses: 0,
//           profit: 0,
//         });

//       map.get(key).totalSales += s.total;
//     });

//     this.purchases.forEach((p) => {
//       const d = new Date(p.purchase_date);
//       const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
//       if (!map.has(key))
//         map.set(key, {
//           month: this.getMonthName(d.getMonth() + 1),
//           totalSales: 0,
//           totalPurchases: 0,
//           totalExpenses: 0,
//           profit: 0,
//         });

//       map.get(key).totalPurchases += p.total;
//     });

//     this.expenses.forEach((e) => {
//       const d = new Date(e.date);
//       const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
//       if (!map.has(key))
//         map.set(key, {
//           month: this.getMonthName(d.getMonth() + 1),
//           totalSales: 0,
//           totalPurchases: 0,
//           totalExpenses: 0,
//           profit: 0,
//         });

//       map.get(key).totalExpenses += e.amount;
//     });

//     map.forEach(
//       (v) => (v.profit = v.totalSales - v.totalPurchases - v.totalExpenses)
//     );

//     this.currentData = Array.from(map.values());
//     this.currentColumns = [
//       { field: 'month', header: 'الشهر' },
//       { field: 'totalSales', header: 'المبيعات', type: 'number' },
//       { field: 'totalPurchases', header: 'المشتريات', type: 'number' },
//       { field: 'totalExpenses', header: 'المصروفات', type: 'number' },
//       { field: 'profit', header: 'صافي الربح', type: 'number' },
//     ];
//   }

//   printPreview() {
//     if (this.currentData.length === 0) {
//       this.confirmDialog.show({
//         message: 'لا يوجد بيانات للطباعة',
//         header: 'تنبيه',
//         acceptLabel: 'إغلاق',
//         showReject: false,
//       });
//       return;
//     }

//     const printWindow = window.open('', '_blank', 'width=850,height=1200');
//     if (!printWindow) return;

//     let tableHTML = '<thead><tr>';

//     this.currentColumns.forEach((col) => {
//       tableHTML += `<th>${col.header}</th>`;
//     });

//     tableHTML += '</tr></thead><tbody>';

//     this.currentData.forEach((row) => {
//       tableHTML += '<tr>';
//       this.currentColumns.forEach((col) => {
//         let v = row[col.field];

//         if (col.type === 'date' && v) {
//           const date = new Date(v);
//           v = date.toLocaleDateString('ar-EG');
//         }

//         if (col.type === 'number' && v !== undefined) {
//           v = v.toLocaleString('ar-EG', { minimumFractionDigits: 2 });
//         }

//         tableHTML += `<td>${v ?? ''}</td>`;
//       });
//       tableHTML += '</tr>';
//     });

//     tableHTML += '</tbody>';

//     printWindow.document.write(`
//       <html dir="rtl">
//         <head>
//           <title>${this.reportTitles[this.currentReport]}</title>
//           <meta charset="UTF-8">
//           <style>
//             table { width: 100%; border-collapse: collapse; }
//             th, td { border: 1px solid #555; padding: 8px; text-align: center; }
//             th { background: #eee; }
//           </style>
//         </head>
//         <body>
//           <h1>${this.reportTitles[this.currentReport]}</h1>
//           <table>${tableHTML}</table>
//           <p style="margin-top:20px;">تاريخ الطباعة: ${new Date().toLocaleString(
//             'ar-EG'
//           )}</p>
//         </body>
//       </html>
//     `);

//     printWindow.document.close();

//     setTimeout(() => {
//       printWindow.print();
//       printWindow.close();
//     }, 300);
//   }

//   getMonthName(m: number): string {
//     return [
//       'يناير',
//       'فبراير',
//       'مارس',
//       'أبريل',
//       'مايو',
//       'يونيو',
//       'يوليو',
//       'أغسطس',
//       'سبتمبر',
//       'أكتوبر',
//       'نوفمبر',
//       'ديسمبر',
//     ][m - 1];
//   }
// }