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
  customerPayments: any[] = [];
  purchases: any[] = [];
  sales: any[] = [];
  supplierPayments: any[] = [];
  selectedCustomerPayment: number | null = null;
  selectedSupplierPayment: number | null = null;
  totalSum: number = 0;
  selectedCustomer: Customer | null = null;
  selectedSupplier: Supplier | null = null;
  dateFrom = new Date();
  dateTo = new Date();

  currentColumns: any[] = [];
  currentData: any[] = [];

  reportTitles: any = {
    expenses: 'تقرير المصروفات',
    customerPayments: 'دفعات العملاء',
    supplierPayments: 'دفعات الموردين',
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
      type: 'customerPayments',
      icon: 'pi pi-users',
      title: 'دفعات العملاء',
      description: 'عرض الدفعات المستلمة من العملاء',
    },
    {
      type: 'supplierPayments',
      icon: 'pi pi-truck',
      title: 'دفعات الموردين',
      description: 'عرض الدفعات المدفوعة للموردين',
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
    this.setDefaultDates();
    this.customers = await this.db.getCustomers();
    this.suppliers = await this.db.getSuppliers();
    this.expenses = await this.db.getExpenses();
    this.customerPayments = await this.db.getCustomerPayments();
    this.supplierPayments = await this.db.getSupplierPayments();
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

  closeReport() {
    this.displayReportDialog = false;
    this.totalSum = 0;
    this.setDefaultDates();
    this.selectedCustomerPayment = null;
    this.selectedSupplierPayment = null;
    this.selectedCustomer = null;
    this.selectedSupplier = null;
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
        this.totalSum = this.currentData.reduce(
          (sum, row) => sum + row.amount,
          0
        );

        break;
      // case 'customerPayments':
      //   this.currentColumns = [
      //     { field: 'receiptNumber', header: 'رقم السند' },
      //     { field: 'customerName', header: 'اسم العميل' },
      //     { field: 'amount', header: 'المبلغ', type: 'number' },
      //     { field: 'date', header: 'التاريخ', type: 'date' },
      //   ];

      //   this.currentData = this.customerPayments.filter(
      //     (p) =>
      //       new Date(p.date) >= this.dateFrom && new Date(p.date) <= this.dateTo
      //   );
      //   break;

      case 'customerPayments':
        this.currentColumns = [
          { field: 'receiptNumber', header: 'رقم السند' },
          { field: 'customerName', header: 'اسم العميل' },
          { field: 'amount', header: 'المبلغ', type: 'number' },
          { field: 'date', header: 'التاريخ', type: 'date' },
        ];

        this.currentData = this.customerPayments.filter((p) => {
          const matchCustomer = this.selectedCustomerPayment
            ? p.customerId === this.selectedCustomerPayment
            : true;

          const matchDate =
            new Date(p.date) >= this.dateFrom &&
            new Date(p.date) <= this.dateTo;

          return matchCustomer && matchDate;
        });
        break;

      // case 'supplierPayments':
      //   this.currentColumns = [
      //     { field: 'receiptNumber', header: 'رقم السند' },
      //     { field: 'supplierName', header: 'اسم المورد' },
      //     { field: 'amount', header: 'المبلغ', type: 'number' },
      //     { field: 'date', header: 'التاريخ', type: 'date' },
      //   ];

      //   this.currentData = this.supplierPayments.filter(
      //     (p) =>
      //       new Date(p.date) >= this.dateFrom && new Date(p.date) <= this.dateTo
      //   );
      //   break;

      case 'supplierPayments':
        this.currentColumns = [
          { field: 'receiptNumber', header: 'رقم السند' },
          { field: 'supplierName', header: 'اسم المورد' },
          { field: 'amount', header: 'المبلغ', type: 'number' },
          { field: 'date', header: 'التاريخ', type: 'date' },
        ];

        this.currentData = this.supplierPayments.filter((p) => {
          const matchSupplier = this.selectedSupplierPayment
            ? p.supplierId === this.selectedSupplierPayment
            : true;

          const matchDate =
            new Date(p.date) >= this.dateFrom &&
            new Date(p.date) <= this.dateTo;

          return matchSupplier && matchDate;
        });
        break;

      case 'purchases':
        this.currentColumns = [
          { field: 'invoice_no', header: 'رقم الفاتورة' },
          { field: 'supplier', header: 'المورد' },
          { field: 'date', header: 'التاريخ', type: 'date' },
          { field: 'total', header: 'إجمالي المبلغ', type: 'number' },
        ];

        this.currentData = this.purchases
          .map((purchase) => {
            return {
              invoice_no: purchase.invoice_no,
              supplier: purchase.supplier || '',

              // تحويل التاريخ الصحيح
              date: new Date(
                purchase.purchase_date || purchase.date || purchase.createdAt
              ),

              total: purchase.total,
            };
          })
          .filter(
            (row) => row.date >= this.dateFrom && row.date <= this.dateTo
          );
        this.totalSum = this.currentData.reduce(
          (sum, row) => sum + row.total,
          0
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

    const customerId = this.selectedCustomer.id;
    const sales = await this.db.getSales();
    const payments = await this.db.getCustomerPayments();

    let result: any[] = [];

    // 1) فواتير البيع
    sales
      .filter((s: any) => s.customer_id === customerId)
      .forEach((s: any) =>
        result.push({
          date: new Date(s.sale_date),
          type: `فاتورة بيع رقم ${s.invoice_no}`,
          amount: s.total,
          paid: s.paid_amount || 0,
          debit: 0, // يتحدد بعد الحساب
          credit: 0,
          order: 1,
        })
      );

    // 2) سندات القبض
    payments
      .filter((p: any) => p.customerId === customerId)
      .forEach((p: any) =>
        result.push({
          date: new Date(p.date),
          type: `سند قبض رقم ${p.receiptNumber}`,
          amount: '-',
          paid: p.amount,
          debit: 0,
          credit: 0,
          order: 2,
        })
      );

    result.sort((a, b) => a.date.getTime() - b.date.getTime());

    let runningBalance = 0;

    this.currentData = result.map((row) => {
      let remaining = 0;

      if (row.order === 1) {
        remaining = row.amount - row.paid;
      } else {
        remaining = -row.paid;
      }
      runningBalance += remaining;
      return {
        ...row,
        debit: runningBalance > 0 ? runningBalance : 0,
        credit: runningBalance < 0 ? Math.abs(runningBalance) : 0,
      };
    });

    this.currentColumns = [
      { field: 'date', header: 'التاريخ', type: 'date' },
      { field: 'type', header: 'البيان' },
      { field: 'amount', header: 'الفاتورة' },
      { field: 'paid', header: 'المدفوع' },
      { field: 'debit', header: 'مدين' },
      { field: 'credit', header: 'دائن' },
    ];
  }

  async generateSupplierStatement() {
    if (!this.selectedSupplier) {
      this.currentData = [];
      return;
    }

    const supplierId =
      typeof this.selectedSupplier === 'number'
        ? this.selectedSupplier
        : this.selectedSupplier?.id;

    console.log('Selected Supplier ID:', supplierId);
    if (typeof supplierId !== 'number') return;
    const purchases = await this.db.getPurchases();
    const payments = await this.db.getSupplierPaymentsBySupplierId(supplierId);

    let result: any[] = [];

    // فواتير الشراء
    purchases
      .filter((p: any) => p.supplierId === supplierId)
      .forEach((p: any) => {
        console.log('Processing Purchase:', p);
        result.push({
          date: new Date(p.purchase_date),
          type: `فاتورة شراء رقم ${p.invoice_no}`,
          amount: p.total,
          paid: p.paid_amount || 0,
          order: 1,
        });
      });

    // سندات الصرف
    payments
      .filter((p: any) => p.supplierId === supplierId)
      .forEach((p: any) => {
        console.log('Processing Payment:', p);
        result.push({
          date: new Date(p.date),
          type: `سند صرف رقم ${p.receiptNumber}`,
          amount: '-',
          paid: p.amount,
          order: 2,
        });
      });

    // ترتيب حسب التاريخ
    result.sort((a, b) => a.date.getTime() - b.date.getTime());

    // حساب الرصيد التراكمي
    let running = 0;

    this.currentData = result.map((row) => {
      let diff = 0;

      if (row.order === 1) {
        diff = row.amount - row.paid; // دائن
      } else {
        diff = -row.paid; // مدين
      }

      running += diff;

      return {
        ...row,
        debit: running < 0 ? Math.abs(running) : 0,
        credit: running > 0 ? running : 0,
      };
    });

    this.currentColumns = [
      { field: 'date', header: 'التاريخ', type: 'date' },
      { field: 'type', header: 'البيان' },
      { field: 'amount', header: 'الفاتورة' },
      { field: 'paid', header: 'المدفوع' },
      { field: 'debit', header: 'مدين' },
      { field: 'credit', header: 'دائن' },
    ];
  }

  // generateMonthlyProfits() {
  //   let totalSales = 0;
  //   let totalPurchases = 0;
  //   let totalExpenses = 0;

  //   this.sales.forEach((s) => {
  //     const d = new Date(s.date);
  //     if (d >= this.dateFrom && d <= this.dateTo) {
  //       totalSales += s.totalAmount;
  //     }
  //   });

  //   this.purchases.forEach((p) => {
  //     const d = new Date(p.date);
  //     if (d >= this.dateFrom && d <= this.dateTo) {
  //       totalPurchases += p.totalAmount;
  //     }
  //   });

  //   this.expenses.forEach((e) => {
  //     const d = new Date(e.date);
  //     if (d >= this.dateFrom && d <= this.dateTo) {
  //       totalExpenses += e.amount;
  //     }
  //   });

  //   const profit = totalSales - totalPurchases - totalExpenses;

  //   this.currentData = [
  //     {
  //       period: `من ${this.dateFrom.toLocaleDateString(
  //         'ar-EG'
  //       )} إلى ${this.dateTo.toLocaleDateString('ar-EG')}`,
  //       totalSales,
  //       totalPurchases,
  //       totalExpenses,
  //       profit,
  //     },
  //   ];

  //   this.currentColumns = [
  //     { field: 'period', header: 'الفترة' },
  //     { field: 'totalSales', header: 'المبيعات', type: 'number' },
  //     { field: 'totalPurchases', header: 'المشتريات', type: 'number' },
  //     { field: 'totalExpenses', header: 'المصروفات', type: 'number' },
  //     { field: 'profit', header: 'صافي الربح', type: 'number' },
  //   ];
  // }
generateMonthlyProfits() {
  let totalSales = 0;
  let totalPurchases = 0;
  let totalExpenses = 0;

  // المبيعات
  this.sales.forEach((s) => {
    const d = new Date(s.sale_date || s.date || s.createdAt);
    if (d >= this.dateFrom && d <= this.dateTo) {
      const amount = Number(s.totalAmount ?? s.total ?? 0);
      totalSales += amount;
    }
  });

  // المشتريات
  this.purchases.forEach((p) => {
    const d = new Date(p.purchase_date || p.date || p.createdAt);
    if (d >= this.dateFrom && d <= this.dateTo) {
      const amount = Number(p.totalAmount ?? p.total ?? 0);
      totalPurchases += amount;
    }
  });

  // المصروفات
  this.expenses.forEach((e) => {
    const d = new Date(e.date);
    if (d >= this.dateFrom && d <= this.dateTo) {
      totalExpenses += Number(e.amount || 0);
    }
  });

  const profit = totalSales - totalPurchases - totalExpenses;

  this.currentData = [
    {
      period: `من ${this.dateFrom.toLocaleDateString(
        'ar-EG'
      )} إلى ${this.dateTo.toLocaleDateString('ar-EG')}`,
      totalSales,
      totalPurchases,
      totalExpenses,
      profit,
    },
  ];

  this.currentColumns = [
    { field: 'period', header: 'الفترة' },
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
        if (col.type === 'number') {
          const numericValue = Number(cellValue);

          if (isNaN(numericValue)) {
            cellValue = '0.00';
          } else {
            cellValue = numericValue.toLocaleString('ar-EG', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
          }
        }

        tableHTML += `<td>${
          cellValue !== undefined && cellValue !== null ? cellValue : ''
        }</td>`;
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

  setDefaultDates() {
    const now = new Date();
    this.dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
    this.dateTo = new Date();
  }
}
