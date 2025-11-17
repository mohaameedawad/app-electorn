// import { Component, OnInit, ViewChild } from '@angular/core';
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
//   styleUrl: './reports.component.scss',
// })
// export class ReportsComponent implements OnInit {
//   @ViewChild(ConfirmationDialogComponent)
//   confirmDialog!: ConfirmationDialogComponent;

//   // Unified dialog
//   displayReportDialog = false;
//   currentReport: string = '';

//   // Data
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
//     {
//       type: 'expenses',
//       icon: 'pi pi-wallet',
//       title: 'تقرير المصروفات',
//       description: 'عرض جميع المصروفات',
//     },
//     {
//       type: 'payments',
//       icon: 'pi pi-money-bill',
//       title: 'تقرير الدفعات',
//       description: 'عرض الدفعات',
//     },
//     {
//       type: 'purchases',
//       icon: 'pi pi-shopping-bag',
//       title: 'تقرير المشتريات',
//       description: 'عرض المشتريات',
//     },
//     {
//       type: 'profits',
//       icon: 'pi pi-chart-line',
//       title: 'تقرير الأرباح الشهرية',
//       description: 'عرض الأرباح',
//     },
//     {
//       type: 'customer',
//       icon: 'pi pi-users',
//       title: 'كشف حساب عميل',
//       description: 'عرض حركة العميل',
//     },
//     {
//       type: 'supplier',
//       icon: 'pi pi-truck',
//       title: 'كشف حساب مورد',
//       description: 'عرض حركة المورد',
//     },
//   ];

//   constructor(private db: DatabaseService) {}

//   async ngOnInit() {
//     this.customers = await this.db.getCustomers();
//     this.suppliers = await this.db.getSuppliers();
//     this.expenses = await this.db.getExpenses();
//     this.payments = await this.db.getPayments();
//     this.purchases = await this.db.getPurchases();
//     this.sales = await this.db.getSales();
//   }

//   // ============================
//   // OPEN REPORT
//   // ============================
//   openReport(type: string) {
//     this.currentReport = type;
//     this.displayReportDialog = true;

//     if (type === 'customer') this.selectedCustomer = null;
//     if (type === 'supplier') this.selectedSupplier = null;

//     this.generateReport();
//   }

//   // ============================
//   // CLOSE REPORT
//   // ============================
//   closeReport() {
//     this.displayReportDialog = false;
//   }

//   // ============================
//   // GENERATE REPORT (Unified)
//   // ============================
//   async generateReport() {
//     switch (this.currentReport) {
//       case 'expenses':
//         this.currentColumns = [
//           { field: 'voucherNumber', header: 'رقم السند' },
//           { field: 'expenseType', header: 'نوع المصروف' },
//           { field: 'date', header: 'التاريخ', type: 'date' },
//           { field: 'amount', header: 'المبلغ' },
//         ];
//         this.currentData = this.expenses.filter(
//           (e) =>
//             new Date(e.date) >= this.dateFrom && new Date(e.date) <= this.dateTo
//         );
//         break;

//       case 'payments':
//         this.currentColumns = [
//           { field: 'receiptNumber', header: 'رقم السند' },
//           { field: 'customerName', header: 'العميل' },
//           { field: 'date', header: 'التاريخ', type: 'date' },
//           { field: 'amount', header: 'المبلغ' },
//         ];
//         this.currentData = this.payments.filter(
//           (e) =>
//             new Date(e.date) >= this.dateFrom && new Date(e.date) <= this.dateTo
//         );
//         break;

//       case 'purchases':
//         this.currentColumns = [
//           { field: 'invoiceNumber', header: 'رقم الفاتورة' },
//           { field: 'supplierName', header: 'المورد' },
//           { field: 'date', header: 'التاريخ', type: 'date' },
//           { field: 'totalAmount', header: 'إجمالي المبلغ' },
//         ];
//         this.currentData = this.purchases.filter(
//           (e) =>
//             new Date(e.date) >= this.dateFrom && new Date(e.date) <= this.dateTo
//         );
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

//   // ============================
//   // CUSTOMER STATEMENT
//   // ============================
//   async generateCustomerStatement() {
//     if (!this.selectedCustomer) {
//       this.currentData = [];
//       return;
//     }

//     const sales = await this.db.getSales();
//     const payments = await this.db.getPayments();

//     const result: any[] = [];

//     sales
//       .filter((s: any) => s.customerName === this.selectedCustomer?.name)
//       .forEach((s: any) =>
//         result.push({
//           date: new Date(s.date),
//           type: 'فاتورة بيع',
//           invoiceNumber: s.invoiceNumber,
//           amount: s.totalAmount,
//           isDebit: true,
//         })
//       );

//     payments
//       .filter((p: any) => p.customerName === this.selectedCustomer?.name)
//       .forEach((p: any) =>
//         result.push({
//           date: new Date(p.date),
//           type: 'سند قبض',
//           invoiceNumber: p.receiptNumber,
//           amount: p.amount,
//           isDebit: false,
//         })
//       );

//     result.sort((a, b) => a.date - b.date);

//     let balance = 0;
//     this.currentData = result.map((t) => {
//       balance += t.isDebit ? t.amount : -t.amount;
//       return {
//         date: t.date,
//         type: t.type,
//         invoiceNumber: t.invoiceNumber,
//         amount: t.amount,
//         balance,
//       };
//     });

//     this.currentColumns = [
//       { field: 'date', header: 'التاريخ', type: 'date' },
//       { field: 'type', header: 'النوع' },
//       { field: 'invoiceNumber', header: 'رقم الفاتورة' },
//       { field: 'amount', header: 'المبلغ' },
//       { field: 'balance', header: 'الرصيد' },
//     ];
//   }

//   // ============================
//   // SUPPLIER STATEMENT
//   // ============================
//   async generateSupplierStatement() {
//     if (!this.selectedSupplier) {
//       this.currentData = [];
//       return;
//     }

//     const purchases = await this.db.getPurchases();
//     const result: any[] = [];

//     purchases
//       .filter((p: any) => p.supplierName === this.selectedSupplier?.name)
//       .forEach((p: any) =>
//         result.push({
//           date: new Date(p.date),
//           type: 'فاتورة شراء',
//           invoiceNumber: p.invoiceNumber,
//           amount: p.totalAmount,
//           isDebit: true,
//         })
//       );

//     result.sort((a, b) => a.date - b.date);

//     let balance = 0;
//     this.currentData = result.map((t) => {
//       balance += t.amount;
//       return {
//         date: t.date,
//         type: t.type,
//         invoiceNumber: t.invoiceNumber,
//         amount: t.amount,
//         balance,
//       };
//     });

//     this.currentColumns = [
//       { field: 'date', header: 'التاريخ', type: 'date' },
//       { field: 'type', header: 'النوع' },
//       { field: 'invoiceNumber', header: 'رقم الفاتورة' },
//       { field: 'amount', header: 'المبلغ' },
//       { field: 'balance', header: 'الرصيد' },
//     ];
//   }

//   // ============================
//   // PROFITS
//   // ============================
//   generateMonthlyProfits() {
//     const map = new Map<string, any>();

//     this.sales.forEach((s) => {
//       const d = new Date(s.date);
//       const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
//       if (!map.has(key))
//         map.set(key, {
//           month: this.getMonthName(d.getMonth() + 1),
//           totalSales: 0,
//           totalPurchases: 0,
//           totalExpenses: 0,
//           profit: 0,
//         });

//       map.get(key).totalSales += s.totalAmount;
//     });

//     this.purchases.forEach((p) => {
//       const d = new Date(p.date);
//       const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
//       if (!map.has(key))
//         map.set(key, {
//           month: this.getMonthName(d.getMonth() + 1),
//           totalSales: 0,
//           totalPurchases: 0,
//           totalExpenses: 0,
//           profit: 0,
//         });

//       map.get(key).totalPurchases += p.totalAmount;
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
//       { field: 'totalSales', header: 'المبيعات' },
//       { field: 'totalPurchases', header: 'المشتريات' },
//       { field: 'totalExpenses', header: 'المصروفات' },
//       { field: 'profit', header: 'صافي الربح' },
//     ];
//   }

//   // printPreview() {

//   //   if (this.currentData.length === 0) {
//   //     this.confirmDialog.show({
//   //       message: 'لا يوجد بيانات للطباعة',
//   //       header: 'تنبيه',
//   //       acceptLabel: 'إغلاق',
//   //       showReject: false,
//   //     });
//   //     return;
//   //   }

//   //   const printContent = document.getElementById('reportPrint');
//   //   if (!printContent) return;

//   //   const printWindow = window.open('', '_blank', 'width=850,height=1200');
//   //   if (!printWindow) return;

//   //   printWindow.document.write(`
//   //   <html dir="rtl">
//   //     <head>
//   //       <title>${this.reportTitles[this.currentReport]}</title>
//   //       <style>
//   //         body {
//   //           font-family: 'Segoe UI', sans-serif;
//   //           padding: 30px;
//   //           direction: rtl;
//   //         }
//   //         h1 { text-align: center; margin-bottom: 10px; }
//   //         h2 { text-align: center; font-size: 18px; margin: 5px 0; }
//   //         table {
//   //           width: 100%;
//   //           border-collapse: collapse;
//   //           margin-top: 20px;
//   //         }
//   //         th, td {
//   //           border: 1px solid #444;
//   //           padding: 8px;
//   //           text-align: center;
//   //           font-size: 14px;
//   //         }
//   //         thead { background: #ddd; font-weight: bold; }
//   //       </style>
//   //     </head>
//   //     <body>
//   //       ${printContent.innerHTML}
//   //     </body>
//   //   </html>
//   // `);

//   //   printWindow.document.close();

//   //   setTimeout(() => {
//   //     printWindow.print();
//   //     printWindow.close();
//   //   }, 200);
//   // }

//   printPreview() {
//   if (this.currentData.length === 0) {
//     this.confirmDialog.show({
//       message: 'لا يوجد بيانات للطباعة',
//       header: 'تنبيه',
//       acceptLabel: 'إغلاق',
//       showReject: false,
//     });
//     return;
//   }

//   const printContent = document.getElementById('reportPrint');
//   if (!printContent) return;

//   const printWindow = window.open('', '_blank', 'width=850,height=1200');
//   if (!printWindow) return;

//   // إنشاء محتوى الجدول
//   let tableHTML = '';

//   // رأس الجدول
//   tableHTML += '<thead><tr>';
//   this.currentColumns.forEach(col => {
//     tableHTML += `<th>${col.header}</th>`;
//   });
//   tableHTML += '</tr></thead>';

//   // بيانات الجدول
//   tableHTML += '<tbody>';
//   this.currentData.forEach(row => {
//     tableHTML += '<tr>';
//     this.currentColumns.forEach(col => {
//       let cellValue = row[col.field];

//       // تنسيق التاريخ
//       if (col.type === 'date' && cellValue) {
//         const date = new Date(cellValue);
//         cellValue = date.toLocaleDateString('ar-EG');
//       }

//       // تنسيق الأرقام
//       if (typeof cellValue === 'number') {
//         cellValue = cellValue.toLocaleString('ar-EG', {
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2
//         });
//       }

//       tableHTML += `<td>${cellValue || ''}</td>`;
//     });
//     tableHTML += '</tr>';
//   });
//   tableHTML += '</tbody>';

//   // معلومات إضافية للعميل/المورد
//   let additionalInfo = '';
//   if (this.currentReport === 'customer' && this.selectedCustomer) {
//     additionalInfo = `
//       <div class="customer-info">
//         <p><strong>الاسم:</strong> ${this.selectedCustomer.name}</p>
//         <p><strong>الكود:</strong> ${this.selectedCustomer.id || ''}</p>
//         <p><strong>رقم التليفون:</strong> ${this.selectedCustomer?.phone || ''}</p>
//       </div>
//     `;
//   } else if (this.currentReport === 'supplier' && this.selectedSupplier) {
//     additionalInfo = `
//       <div class="customer-info">
//         <p><strong>الاسم:</strong> ${this.selectedSupplier.name}</p>
//         <p><strong>الكود:</strong> ${this.selectedSupplier.code || ''}</p>
//       </div>
//     `;
//   }

//   printWindow.document.write(`
//     <html dir="rtl">
//       <head>
//         <title>${this.reportTitles[this.currentReport]}</title>
//         <meta charset="UTF-8">
//         <style>
//           * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//           }

//           body {
//             font-family: 'Segoe UI', 'Tahoma', Arial, sans-serif;
//             padding: 20px;
//             direction: rtl;
//             background: white;
//           }

//           .header {
//             text-align: center;
//             margin-bottom: 30px;
//             border-bottom: 3px solid #333;
//             padding-bottom: 15px;
//           }

//           .header h1 {
//             font-size: 24px;
//             font-weight: bold;
//             margin-bottom: 10px;
//             color: #000;
//           }

//           .customer-info {
//             background: #f5f5f5;
//             padding: 15px;
//             margin-bottom: 20px;
//             border: 1px solid #ddd;
//             border-radius: 5px;
//           }

//           .customer-info p {
//             margin: 5px 0;
//             font-size: 14px;
//           }

//           table {
//             width: 100%;
//             border-collapse: collapse;
//             margin: 20px 0;
//             font-size: 13px;
//           }

//           th {
//             background: #e8e8e8;
//             border: 1px solid #999;
//             padding: 10px 8px;
//             text-align: center;
//             font-weight: bold;
//             color: #000;
//           }

//           td {
//             border: 1px solid #999;
//             padding: 8px;
//             text-align: center;
//             color: #000;
//           }

//           tbody tr:nth-child(even) {
//             background: #fafafa;
//           }

//           tbody tr:hover {
//             background: #f0f0f0;
//           }

//           .footer {
//             margin-top: 30px;
//             text-align: center;
//             font-size: 12px;
//             color: #666;
//             border-top: 1px solid #ddd;
//             padding-top: 10px;
//           }

//           @media print {
//             body {
//               padding: 10px;
//             }

//             .header {
//               border-bottom: 2px solid #000;
//             }

//             table {
//               page-break-inside: auto;
//             }

//             tr {
//               page-break-inside: avoid;
//               page-break-after: auto;
//             }

//             thead {
//               display: table-header-group;
//             }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="header">
//           <h1>${this.reportTitles[this.currentReport]}</h1>
//         </div>

//         ${additionalInfo}

//         <table>
//           ${tableHTML}
//         </table>

//         <div class="footer">
//           <p>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-EG')} - ${new Date().toLocaleTimeString('ar-EG')}</p>
//         </div>
//       </body>
//     </html>
//   `);

//   printWindow.document.close();

//   setTimeout(() => {
//     printWindow.print();
//     printWindow.close();
//   }, 300);
// }

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

import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '../../shared/components/table/table.component';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { DatabaseService } from '../../services/database.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';

interface Customer {
  name: string;
  phone?: string;
  id?: number;
  [key: string]: any;
}

interface Supplier {
  name: string;
  code?: string;
  phone?: string;
  id?: number;
  [key: string]: any;
}

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
    DialogComponent,
    ConfirmationDialogComponent,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent implements OnInit {
  @ViewChild(ConfirmationDialogComponent)
  confirmDialog!: ConfirmationDialogComponent;

  // Unified dialog
  displayReportDialog = false;
  currentReport: string = '';

  // Data
  customers: any[] = [];
  suppliers: any[] = [];
  expenses: any[] = [];
  payments: any[] = [];
  purchases: any[] = [];
  sales: any[] = [];
  selectedCustomer: Customer | null = null;
  selectedSupplier: Supplier | null = null;
  dateFrom = new Date();
  dateTo = new Date();

  currentColumns: any[] = [];
  currentData: any[] = [];

  reportTitles: any = {
    expenses: 'تقرير المصروفات',
    payments: 'تقرير الدفعات',
    purchases: 'تقرير المشتريات',
    profits: 'تقرير الأرباح الشهرية',
    customer: 'كشف حساب عميل',
    supplier: 'كشف حساب مورد',
  };

  reportCards = [
    {
      type: 'expenses',
      icon: 'pi pi-wallet',
      title: 'تقرير المصروفات',
      description: 'عرض جميع المصروفات',
    },
    {
      type: 'payments',
      icon: 'pi pi-money-bill',
      title: 'تقرير الدفعات',
      description: 'عرض الدفعات',
    },
    {
      type: 'purchases',
      icon: 'pi pi-shopping-bag',
      title: 'تقرير المشتريات',
      description: 'عرض المشتريات',
    },
    {
      type: 'profits',
      icon: 'pi pi-chart-line',
      title: 'تقرير الأرباح الشهرية',
      description: 'عرض الأرباح',
    },
    {
      type: 'customer',
      icon: 'pi pi-users',
      title: 'كشف حساب عميل',
      description: 'عرض حركة العميل',
    },
    {
      type: 'supplier',
      icon: 'pi pi-truck',
      title: 'كشف حساب مورد',
      description: 'عرض حركة المورد',
    },
  ];

  constructor(private db: DatabaseService) {}

  async ngOnInit() {
    this.customers = await this.db.getCustomers();
    this.suppliers = await this.db.getSuppliers();
    this.expenses = await this.db.getExpenses();
    this.payments = await this.db.getPayments();
    this.purchases = await this.db.getPurchases();
    this.sales = await this.db.getSales();
  }

  // ============================
  // OPEN REPORT
  // ============================
  openReport(type: string) {
    this.currentReport = type;
    this.displayReportDialog = true;

    if (type === 'customer') this.selectedCustomer = null;
    if (type === 'supplier') this.selectedSupplier = null;

    this.generateReport();
  }

  // ============================
  // CLOSE REPORT
  // ============================
  closeReport() {
    this.displayReportDialog = false;
  }

  // ============================
  // GENERATE REPORT (Unified)
  // ============================
  async generateReport() {
    switch (this.currentReport) {
      case 'expenses':
        this.currentColumns = [
          { field: 'voucherNumber', header: 'رقم السند' },
          { field: 'expenseType', header: 'نوع المصروف' },
          { field: 'date', header: 'التاريخ', type: 'date' },
          { field: 'amount', header: 'المبلغ', type: 'number' },
        ];
        this.currentData = this.expenses.filter(
          (e) =>
            new Date(e.date) >= this.dateFrom && new Date(e.date) <= this.dateTo
        );
        break;

      case 'payments':
        this.currentColumns = [
          { field: 'receiptNumber', header: 'رقم السند' },
          { field: 'customerName', header: 'العميل' },
          { field: 'date', header: 'التاريخ', type: 'date' },
          { field: 'amount', header: 'المبلغ', type: 'number' },
        ];
        this.currentData = this.payments.filter(
          (e) =>
            new Date(e.date) >= this.dateFrom && new Date(e.date) <= this.dateTo
        );
        break;

      case 'purchases':
        this.currentColumns = [
          { field: 'invoiceNumber', header: 'رقم الفاتورة' },
          { field: 'supplierName', header: 'المورد' },
          { field: 'date', header: 'التاريخ', type: 'date' },
          { field: 'totalAmount', header: 'إجمالي المبلغ', type: 'number' },
        ];
        this.currentData = this.purchases.filter(
          (e) =>
            new Date(e.date) >= this.dateFrom && new Date(e.date) <= this.dateTo
        );
        break;

      case 'profits':
        this.generateMonthlyProfits();
        break;

      case 'customer':
        this.generateCustomerStatement();
        break;

      case 'supplier':
        this.generateSupplierStatement();
        break;
    }
  }

  // ============================
  // CUSTOMER STATEMENT
  // ============================
  async generateCustomerStatement() {
    if (!this.selectedCustomer) {
      this.currentData = [];
      return;
    }

    const sales = await this.db.getSales();
    const payments = await this.db.getPayments();

    const result: any[] = [];

    sales
      .filter((s: any) => s.customerName === this.selectedCustomer?.name)
      .forEach((s: any) =>
        result.push({
          date: new Date(s.date),
          type: 'فاتورة بيع',
          invoiceNumber: s.invoiceNumber,
          debit: s.totalAmount, // مدين
          credit: 0, // دائن
        })
      );

    payments
      .filter((p: any) => p.customerName === this.selectedCustomer?.name)
      .forEach((p: any) =>
        result.push({
          date: new Date(p.date),
          type: 'سند قبض',
          invoiceNumber: p.receiptNumber,
          debit: 0, // مدين
          credit: p.amount, // دائن
        })
      );

    result.sort((a, b) => a.date.getTime() - b.date.getTime());

    let balance = 0;
    this.currentData = result.map((t) => {
      balance += t.debit - t.credit;
      return {
        date: t.date,
        type: t.type,
        invoiceNumber: t.invoiceNumber,
        debit: t.debit,
        credit: t.credit,
        balance,
      };
    });

    this.currentColumns = [
      { field: 'date', header: 'التاريخ', type: 'date' },
      { field: 'type', header: 'البيان' },
      { field: 'invoiceNumber', header: 'رقم الفاتورة' },
      { field: 'debit', header: 'مدين', type: 'number' },
      { field: 'credit', header: 'دائن', type: 'number' },
      { field: 'balance', header: 'الرصيد', type: 'number' },
    ];
  }

  // ============================
  // SUPPLIER STATEMENT
  // ============================
  async generateSupplierStatement() {
    if (!this.selectedSupplier) {
      this.currentData = [];
      return;
    }

    const purchases = await this.db.getPurchases();
    const result: any[] = [];

    purchases
      .filter((p: any) => p.supplierName === this.selectedSupplier?.name)
      .forEach((p: any) =>
        result.push({
          date: new Date(p.date),
          type: 'فاتورة شراء',
          invoiceNumber: p.invoiceNumber,
          debit: p.totalAmount,
          credit: 0,
        })
      );

    result.sort((a, b) => a.date.getTime() - b.date.getTime());

    let balance = 0;
    this.currentData = result.map((t) => {
      balance += t.debit - t.credit;
      return {
        date: t.date,
        type: t.type,
        invoiceNumber: t.invoiceNumber,
        debit: t.debit,
        credit: t.credit,
        balance,
      };
    });

    this.currentColumns = [
      { field: 'date', header: 'التاريخ', type: 'date' },
      { field: 'type', header: 'البيان' },
      { field: 'debit', header: 'مدين', type: 'number' },
      { field: 'credit', header: 'دائن', type: 'number' },
      { field: 'balance', header: 'الرصيد', type: 'number' },
    ];
  }

  // ============================
  // PROFITS
  // ============================
  generateMonthlyProfits() {
    const map = new Map<string, any>();

    this.sales.forEach((s) => {
      const d = new Date(s.date);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      if (!map.has(key))
        map.set(key, {
          month: this.getMonthName(d.getMonth() + 1),
          totalSales: 0,
          totalPurchases: 0,
          totalExpenses: 0,
          profit: 0,
        });

      map.get(key).totalSales += s.totalAmount;
    });

    this.purchases.forEach((p) => {
      const d = new Date(p.date);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      if (!map.has(key))
        map.set(key, {
          month: this.getMonthName(d.getMonth() + 1),
          totalSales: 0,
          totalPurchases: 0,
          totalExpenses: 0,
          profit: 0,
        });

      map.get(key).totalPurchases += p.totalAmount;
    });

    this.expenses.forEach((e) => {
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      if (!map.has(key))
        map.set(key, {
          month: this.getMonthName(d.getMonth() + 1),
          totalSales: 0,
          totalPurchases: 0,
          totalExpenses: 0,
          profit: 0,
        });

      map.get(key).totalExpenses += e.amount;
    });

    map.forEach(
      (v) => (v.profit = v.totalSales - v.totalPurchases - v.totalExpenses)
    );

    this.currentData = Array.from(map.values());
    this.currentColumns = [
      { field: 'month', header: 'الشهر' },
      { field: 'totalSales', header: 'المبيعات', type: 'number' },
      { field: 'totalPurchases', header: 'المشتريات', type: 'number' },
      { field: 'totalExpenses', header: 'المصروفات', type: 'number' },
      { field: 'profit', header: 'صافي الربح', type: 'number' },
    ];
  }

  // ============================
  // PRINT PREVIEW
  // ============================
  printPreview() {
    if (this.currentData.length === 0) {
      this.confirmDialog.show({
        message: 'لا يوجد بيانات للطباعة',
        header: 'تنبيه',
        acceptLabel: 'إغلاق',
        showReject: false,
      });
      return;
    }

    const printContent = document.getElementById('reportPrint');
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=850,height=1200');
    if (!printWindow) return;

    // إنشاء محتوى الجدول
    let tableHTML = '';

    // رأس الجدول
    tableHTML += '<thead><tr>';
    this.currentColumns.forEach((col) => {
      tableHTML += `<th>${col.header}</th>`;
    });
    tableHTML += '</tr></thead>';

    // بيانات الجدول
    tableHTML += '<tbody>';
    this.currentData.forEach((row) => {
      tableHTML += '<tr>';
      this.currentColumns.forEach((col) => {
        let cellValue = row[col.field];

        // تنسيق التاريخ
        if (col.type === 'date' && cellValue) {
          const date = new Date(cellValue);
          cellValue = date.toLocaleDateString('ar-EG');
        }

        // تنسيق الأرقام
        if (col.type === 'number' && cellValue !== undefined) {
          if (cellValue === 0) {
            cellValue = '0.00';
          } else {
            cellValue = cellValue.toLocaleString('ar-EG', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
          }
        }

        tableHTML += `<td>${cellValue || ''}</td>`;
      });
      tableHTML += '</tr>';
    });
    tableHTML += '</tbody>';

    // معلومات إضافية للعميل/المورد
    let additionalInfo = '';
    if (this.currentReport === 'customer' && this.selectedCustomer) {
      additionalInfo = `
        <div class="customer-info">
          <div class="info-row">
            <span><strong>الاسم:</strong> ${this.selectedCustomer.name}</span>
            <span><strong>الكود:</strong> ${
              this.selectedCustomer.id || 'غير محدد'
            }</span>
          </div>
          <div class="info-row">
            <span><strong>رقم التليفون:</strong> ${
              this.selectedCustomer.phone || 'غير محدد'
            }</span>
          </div>
        </div>
      `;
    } else if (this.currentReport === 'supplier' && this.selectedSupplier) {
      additionalInfo = `
        <div class="customer-info">
          <div class="info-row">
            <span><strong>الاسم:</strong> ${this.selectedSupplier.name}</span>
            <span><strong>الكود:</strong> ${
              this.selectedSupplier.code || 'غير محدد'
            }</span>
          </div>
        </div>
      `;
    }

    printWindow.document.write(`
      <html dir="rtl">
        <head>
          <title>${this.reportTitles[this.currentReport]}</title>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', 'Tahoma', Arial, sans-serif;
              padding: 20px;
              direction: rtl;
              background: white;
            }
            
            .header {
              text-align: center;
              margin-bottom: 20px;
              border: 2px solid #333;
              padding: 10px;
              background: white;
            }
            
            .header h1 {
              font-size: 20px;
              font-weight: bold;
              color: #000;
            }
            
            .customer-info {
              background: #f9f9f9;
              padding: 15px;
              margin-bottom: 20px;
              border: 1px solid #ccc;
            }
            
            .info-row {
              display: flex;
              justify-content: space-between;
              margin: 8px 0;
              font-size: 14px;
            }
            
            .info-row span {
              flex: 1;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              font-size: 13px;
            }
            
            th {
              background: #e0e0e0;
              border: 1px solid #666;
              padding: 10px 5px;
              text-align: center;
              font-weight: bold;
              color: #000;
            }
            
            td {
              border: 1px solid #666;
              padding: 8px 5px;
              text-align: center;
              color: #000;
            }
            
            tbody tr:nth-child(even) {
              background: #f5f5f5;
            }
            
            /* عرض محدد للأعمدة */
            th:nth-child(1), td:nth-child(1) { width: 12%; } /* التاريخ */
            th:nth-child(2), td:nth-child(2) { width: 20%; } /* البيان */
            th:nth-child(3), td:nth-child(3) { width: 15%; } /* رقم الفاتورة */
            th:nth-child(4), td:nth-child(4) { width: 18%; } /* مدين */
            th:nth-child(5), td:nth-child(5) { width: 18%; } /* دائن */
            th:nth-child(6), td:nth-child(6) { width: 17%; } /* الرصيد */
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 11px;
              color: #666;
              border-top: 1px solid #ccc;
              padding-top: 10px;
            }
            
            @media print {
              body {
                padding: 10px;
              }
              
              thead {
                display: table-header-group;
              }
              
              tr {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${this.reportTitles[this.currentReport]}</h1>
          </div>
          
          ${additionalInfo}
          
          <table>
            ${tableHTML}
          </table>
          
          <div class="footer">
            <p>تاريخ الطباعة: ${new Date().toLocaleDateString(
              'ar-EG'
            )} - ${new Date().toLocaleTimeString('ar-EG')}</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  }

  getMonthName(m: number): string {
    return [
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
    ][m - 1];
  }
}
