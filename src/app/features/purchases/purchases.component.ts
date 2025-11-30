import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '../../shared/components/table/table.component';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { DatabaseService } from '../../services/database.service';

// Correct PrimeNG imports for v19
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-purchases',
  imports: [
    CommonModule,
    FormsModule,
    TableComponent,
    DialogComponent,
    ConfirmationDialogComponent,
    SelectModule,
    InputTextModule,
    ButtonModule,
    DatePickerModule,
    InputNumberModule,
    TableModule,
  ],
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.scss',
})
export class PurchasesComponent implements OnInit {
  @ViewChild(ConfirmationDialogComponent)
  confirmDialog!: ConfirmationDialogComponent;

  columns = [
    { header: 'رقم الفاتورة', field: 'invoice_no' },
    { header: 'التاريخ', field: 'purchase_date' },
    { header: 'المورد', field: 'supplier' },
    { header: 'الإجمالي', field: 'total' },
    { header: 'الحالة', field: 'status' },
    {
      header: 'إجراءات',
      field: 'actions',
      type: 'actions',
      actions: ['edit', 'delete', 'preview', 'print'],
    },
  ];

  data: any[] = [];
  visible: boolean = false;
  previewVisible: boolean = false;
  // when editing an existing purchase, keep its id here
  editingPurchaseId: number | null = null;

  // Company information for invoice
  companyName: string = 'Luvi';
  companyPhone: string = '01070121737';

  // بيانات الفاتورة الجديدة
  newPurchase = {
    invoice_no: 0,
    supplierId: null,
    employee_id: null,
    purchase_date: new Date(),
    items: [] as any[],
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
    paid_amount: 0,
    status: 'معلقة',
  };

  // الصنف الحالي قيد الإضافة
  currentItem = {
    product_id: null,
    quantity: 1,
    price: 0,
    total: 0,
  };

  // Preview purchase data
  previewPurchase: any = {
    invoice_no: null,
    supplierId: null,
    purchase_date: new Date(),
    items: [],
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
    paid_amount: 0,
    status: 'معلقة',
  };

  products: any[] = [];
  suppliers: any[] = [];
  employees: any[] = [];
  showValidationErrors: boolean = false;

  constructor(private dbService: DatabaseService) {}

  async ngOnInit() {
    await this.loadPurchases();
    await this.loadProducts();
    await this.loadSuppliers();
    await this.loadEmployees();
    this.generateInvoiceNumber();
  }

  async loadPurchases() {
    this.data = await this.dbService.getPurchases();
  }

  async loadProducts() {
    const productsList = await this.dbService.getProducts();
    this.products = productsList.map((p: any) => ({
      label: p.name,
      value: p.id,
      price: p.purchase_price || p.price || 0,
    }));
  }

  async loadSuppliers() {
    const suppliersList = await this.dbService.getSuppliers();
    this.suppliers = suppliersList.map((s: any) => ({
      label: s.name,
      value: s.id,
    }));
  }

  async loadEmployees() {
    const employeesList = await this.dbService.getEmployees();
    this.employees = employeesList.map((e: any) => ({
      label: e.name,
      value: e.id,
    }));
  }

  generateInvoiceNumber() {
    const lastInvoice =
      this.data.length > 0 ? this.data[this.data.length - 1].invoice_no : 0;
    this.newPurchase.invoice_no = lastInvoice + 1;
  }

  // handle edit action from table
  async onEdit(purchase: any) {
    // bind data to form and open dialog
    // load full purchase data (items may be stored as JSON string)
    const purchaseCopy: any = { ...purchase };
    try {
      purchaseCopy.items =
        typeof purchaseCopy.items === 'string'
          ? JSON.parse(purchaseCopy.items)
          : purchaseCopy.items || [];
    } catch (err) {
      purchaseCopy.items = purchaseCopy.items || [];
    }

    this.newPurchase = {
      invoice_no: purchaseCopy.invoice_no || 0,
      supplierId: purchaseCopy.supplierId || null,
      employee_id: purchaseCopy.employee_id || null,
      purchase_date: purchaseCopy.purchase_date
        ? new Date(purchaseCopy.purchase_date)
        : new Date(),
      items: purchaseCopy.items || [],
      subtotal: purchaseCopy.subtotal || 0,
      discount: purchaseCopy.discount || 0,
      tax: purchaseCopy.tax || 0,
      total: purchaseCopy.total || 0,
      paid_amount: purchaseCopy.paid_amount || 0,
      status: purchaseCopy.status || 'معلقة',
    };
    this.editingPurchaseId = purchaseCopy.id || null;
    this.visible = true;
  }

  // handle delete action from table
  async onDelete(purchase: any) {
    const id = purchase?.id;
    if (!id) return;

    this.confirmDialog.show({
      message: `هل أنت متأكد من حذف فاتورة المشتريات رقم "${purchase.invoice_no}"؟ `,
      header: 'تأكيد الحذف',
      acceptLabel: 'حذف',
      rejectLabel: 'إلغاء',
      accept: async () => {
        try {
          await this.dbService.deletePurchase(id);
          await this.loadPurchases();
        } catch (err) {
          console.error('Error deleting purchase:', err);
        }
      },
    });
  }

  // handle preview action from table
  async onPreview(purchase: any) {
    // Parse items if stored as JSON string
    const purchaseCopy: any = { ...purchase };
    try {
      purchaseCopy.items =
        typeof purchaseCopy.items === 'string'
          ? JSON.parse(purchaseCopy.items)
          : purchaseCopy.items || [];
    } catch (err) {
      purchaseCopy.items = purchaseCopy.items || [];
    }

    this.previewPurchase = {
      invoice_no: purchaseCopy.invoice_no || 0,
      supplierId: purchaseCopy.supplierId || null,
      purchase_date: purchaseCopy.purchase_date
        ? new Date(purchaseCopy.purchase_date)
        : new Date(),
      items: purchaseCopy.items || [],
      subtotal: purchaseCopy.subtotal || 0,
      discount: purchaseCopy.discount || 0,
      tax: purchaseCopy.tax || 0,
      total: purchaseCopy.total || 0,
      paid_amount: purchaseCopy.paid_amount || 0,
      status: purchaseCopy.status || 'معلقة',
    };
    this.previewVisible = true;
  }

  // preview current invoice in dialog
  previewInvoice() {
    if (this.newPurchase.items.length === 0) {
      this.confirmDialog.show({
        message: 'يجب إضافة صنف واحد على الأقل للمعاينة',
        header: 'تنبيه',
        acceptLabel: 'إلغاء',
        showReject: false,
      });
      return;
    }
    this.previewPurchase = { ...this.newPurchase };
    this.previewVisible = true;
  }

  // print current invoice in dialog
  printInvoice() {
    this.previewInvoice();
  }

  // Print from preview dialog

printPreview() {
  const printContent = document.querySelector('.invoice-preview');
  if (!printContent) return;

  const printWindow = window.open('', '_blank', 'width=850,height=1200');
  if (!printWindow) return;

  // Get company info
  const companyName = this.companyName;
  const companyPhone = this.companyPhone;
  const invoiceNo = this.previewPurchase.invoice_no;
  const supplierName = this.getSupplierName(this.previewPurchase.supplierId);
  const purchaseDate = this.formatPreviewDate(this.previewPurchase.purchase_date);
  const items = this.previewPurchase.items;
  const subtotal = this.previewPurchase.subtotal;
  const discount = this.previewPurchase.discount;
  const total = this.previewPurchase.total;
  
  // Get current date for print date
  const now = new Date();
  const printDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const printTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const printDateTime = `${printDate} ${printTime}`;

  // Build HTML with pagination support
  let htmlContent = `
    <html dir="rtl">
      <head>
        <title>طباعة الفاتورة</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html {
            background: #f5f5f5;
          }
           body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: white;
          }
          body { 
            margin: 0 auto;
            max-width: 210mm;
          }
          
          /* Header styles */
          .company-info {
            margin-bottom: 1rem;
          }
          .company-name {
            font-size: 1.8rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
          }
          .company-phone {
            font-size: 1rem;
            color: #666;
          }
          
          .invoice-header { 
            text-align: center; 
            margin-bottom: 1.5rem; 
          }
           .invoice-header h1 { 
            font-size: 1.6rem; 
            font-weight: bold; 
            margin-bottom: 1rem; 
            border: 2px solid #000; 
            padding: 0.6rem;
            display: inline-block;
            width: 100%;
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
            margin-bottom: 0.5rem; 
          }
          .info-item { 
            flex: 1; 
            display: flex; 
            gap: 0.5rem; 
          }
          .label { 
            font-weight: 600; 
            min-width: 80px; 
          }
          
          /* Table styles */
          .preview-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 1rem; 
          }
          .preview-table thead { 
            background-color: #dddddd; 
            color: #000000; 
          }
          .preview-table th { 
            padding: 0.5rem; 
            text-align: center; 
            font-weight: 600; 
            border: 1px solid #000; 
            font-size: 0.95rem; 
          }
          .preview-table tbody tr:nth-child(even) { 
            background-color: #f9f9f9; 
          }
          .preview-table td { 
            padding: 0.5rem; 
            text-align: center; 
            border: 1px solid #ddd; 
            font-size: 0.9rem; 
          }
          
          /* Totals table */
          .totals-table { 
            margin-bottom: 1rem; 
            margin-top: 0; 
          }
          .totals-table tbody tr td.total-header { 
            background-color: #dddddd; 
            border: 1px solid #000; 
            font-weight: 700; 
            font-size: 1rem; 
            padding: 0.6rem; 
            text-align: center; 
          }
          .totals-table tbody tr td.total-value { 
            background-color: #f9f9f9; 
            font-weight: 600; 
            font-size: 1rem; 
            border: 1px solid #000; 
            padding: 0.6rem; 
            text-align: center; 
          }
          .totals-table .final-total { 
            font-weight: 700; 
            font-size: 1.1rem; 
          }
          
          /* Page break handling */
          .page {
            page-break-after: always;
            width: 210mm;
            min-height: 297mm;
            position: relative;
            padding: 1cm;
            margin-bottom: 2cm;
            border: 1px solid #ddd;
            background: white;
            box-sizing: border-box;
          }
          .page:last-child {
            page-break-after: auto;
            margin-bottom: 0;
          }
          
          /* Page footer with number and date */
          .page-footer {
            position: absolute;
            bottom: 0.8cm;
            left: 1.5cm;
            right: 1.5cm;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.85rem;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 0.5rem;
          }
          .page-number {
            font-weight: 500;
          }
          .print-date {
            font-weight: 500;
          }
          
          @media print {
            html, body { 
              width: 210mm; 
            }
            body { 
              padding: 0; 
            }
            @page { 
              size: A4; 
              margin: 0; 
            }
            .page {
              page-break-after: always;
              margin-bottom: 0;
              border: none;
              box-shadow: none;
              width: 210mm;
              min-height: 297mm;
            }
            .page:last-child {
              page-break-after: auto;
            }
            tbody tr {
              page-break-inside: avoid;
            }
            .page-footer {
              position: absolute;
              bottom: 0.8cm;
            }
          }
          
          @media screen {
            body {
              background: #f5f5f5;
              padding: 1.5cm 0;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .page {
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
          }
        </style>
      </head>
      <body>
  `;

  // Calculate items per page (approximately 15-20 items per A4 page)
  const itemsPerPage = 17;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Generate pages
  for (let pageNum = 0; pageNum < totalPages; pageNum++) {
    const startIdx = pageNum * itemsPerPage;
    const endIdx = Math.min(startIdx + itemsPerPage, items.length);
    const pageItems = items.slice(startIdx, endIdx);
    const isLastPage = pageNum === totalPages - 1;

    htmlContent += `
      <div class="page">
        <!-- Company Info (on every page) -->
        <div class="company-info">
          <h2 class="company-name">${companyName}</h2>
          <p class="company-phone">رقم الهاتف: ${companyPhone}</p>
        </div>

        <!-- Invoice Header (on every page) -->
        <div class="invoice-header">
          <h1>فاتورة مشتريات</h1>
        </div>

        <!-- Customer Info (on every page) -->
        <div class="customer-info">
          <div class="info-row">
            <div class="info-item">
              <span class="label">المورد:</span>
              <span class="value">${supplierName}</span>
            </div>
            <div class="info-item">
              <span class="label">رقم الفاتورة:</span>
              <span class="value">${invoiceNo}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="label">التاريخ:</span>
              <span class="value">${purchaseDate}</span>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <table class="preview-table">
          <thead>
            <tr>
              <th>الوصف</th>
              <th>الكمية</th>
              <th>السعر</th>
              <th>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
    `;

    // Add items for this page
    pageItems.forEach((item: any) => {
      htmlContent += `
            <tr>
              <td>${item.product_name}</td>
              <td>${item.quantity}</td>
              <td>${item.price} ج.م</td>
              <td>${item.total} ج.م</td>
            </tr>
      `;
    });

    htmlContent += `
          </tbody>
        </table>
    `;

    // Add totals on last page only
    if (isLastPage) {
      htmlContent += `
        <table class="preview-table totals-table">
          <tbody>
            <tr>
              <td class="total-header">الإجمالي</td>
              <td class="total-value">${subtotal} ج.م</td>
      `;
      
      if (discount > 0) {
        htmlContent += `
              <td class="total-header">الخصم</td>
              <td class="total-value">${discount} ج.م</td>
              <td class="total-header">الصافي</td>
              <td class="total-value final-total">${total} ج.م</td>
        `;
      }
      
      htmlContent += `
            </tr>
          </tbody>
        </table>
      `;
    }

    // Add page number and print date
    htmlContent += `
        <div class="page-footer">
          <span class="page-number">صفحة ${pageNum + 1} من ${totalPages}</span>
          <span class="print-date">تاريخ الطباعة: ${printDateTime}</span>
        </div>
      </div>
    `;
  }

  htmlContent += `
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}

  // Close preview dialog
  closePreview() {
    this.previewVisible = false;
  }

  // Get supplier name by ID
  getSupplierName(supplierId: any): string {
    const supplier = this.suppliers.find((s) => s.value === supplierId);
    return supplier ? supplier.label : '';
  }

  // Format date for preview
  formatPreviewDate(date: Date): string {
    return this.formatDate(date);
  }

  showDialog() {
    this.generateInvoiceNumber();
    this.visible = true;
  }

  onProductChange() {
    const selectedProduct = this.products.find(
      (p) => p.value === this.currentItem.product_id
    );
    if (selectedProduct) {
      this.currentItem.price = selectedProduct.price;
      this.calculateItemTotal();
    }
  }

  onQuantityChange() {
    this.calculateItemTotal();
  }

  calculateItemTotal() {
    this.currentItem.total = this.currentItem.quantity * this.currentItem.price;
  }

  addItem() {
    // Validate inputs
    if (
      !this.currentItem.product_id ||
      !this.currentItem.quantity ||
      this.currentItem.quantity <= 0 ||
      !this.currentItem.price ||
      this.currentItem.price <= 0
    ) {
      this.showValidationErrors = true;
      return;
    }

    this.showValidationErrors = false;
    const product = this.products.find(
      (p) => p.value === this.currentItem.product_id
    );
    this.newPurchase.items.push({
      product_id: this.currentItem.product_id,
      product_name: product?.label || '',
      quantity: this.currentItem.quantity,
      price: this.currentItem.price,
      total: this.currentItem.total,
    });

    this.calculateInvoiceTotal();
    this.resetCurrentItem();
  }

  removeItem(index: number) {
    this.newPurchase.items.splice(index, 1);
    this.calculateInvoiceTotal();
  }

  updateItemTotal(index: number) {
    const item = this.newPurchase.items[index];
    item.total = item.quantity * item.price;
    this.calculateInvoiceTotal();
  }

  calculateInvoiceTotal() {
    this.newPurchase.subtotal = this.newPurchase.items.reduce(
      (sum, item) => sum + item.total,
      0
    );
    // discount is now an absolute number (not percentage)
    const discountAmount = Number(this.newPurchase.discount) || 0;
    const afterDiscount = Math.max(
      0,
      this.newPurchase.subtotal - discountAmount
    );
    const taxAmount =
      (afterDiscount * (Number(this.newPurchase.tax) || 0)) / 100;
    this.newPurchase.total = afterDiscount + taxAmount;
  }

  resetCurrentItem() {
    this.currentItem = {
      product_id: null,
      quantity: 1,
      price: 0,
      total: 0,
    };
    this.showValidationErrors = false;
  }

  async savePurchase() {
    try {
      if (this.newPurchase.items.length === 0 || !this.newPurchase.supplierId) {
        this.confirmDialog.show({
          message:
            this.newPurchase.items.length === 0
              ? 'يجب إضافة صنف واحد على الأقل'
              : 'يجب اختيار المورد',
          header: 'تنبيه',
          acceptLabel: 'إلغاء',
          showReject: false,
        });
        return;
      }

      const supplier = this.suppliers.find(
        (s: any) => s.value === this.newPurchase.supplierId
      );
      const purchaseData = {
        invoice_no: this.newPurchase.invoice_no,
        supplierId: this.newPurchase.supplierId,
        supplier: supplier?.label || '',
        employee_id: this.newPurchase.employee_id,
        items: this.newPurchase.items,
        subtotal: this.newPurchase.subtotal,
        discount: this.newPurchase.discount,
        tax: this.newPurchase.tax,
        total: this.newPurchase.total,
        paid_amount: this.newPurchase.paid_amount,
        status: this.newPurchase.status,
        purchase_date: this.formatDate(this.newPurchase.purchase_date),
        remaining: this.newPurchase.total - this.newPurchase.paid_amount,
      };

      if (this.editingPurchaseId) {
        await this.dbService.updatePurchase(
          this.editingPurchaseId,
          purchaseData
        );
      } else {
        await this.dbService.addPurchase(purchaseData);
      }
      await this.loadPurchases();
      await this.loadSuppliers();
      this.previewPurchase = { ...this.newPurchase };

      this.visible = false;

      this.resetForm();
      this.editingPurchaseId = null;

      // Open preview dialog for printing
      this.previewVisible = true;
    } catch (error) {
      console.error('Error saving purchase:', error);
    }
  }

  closeDialog() {
    this.visible = false;
    this.resetForm();
  }

  onDialogHide() {
    this.visible = false;
    this.resetForm();
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  resetForm() {
    this.newPurchase = {
      invoice_no: 0,
      supplierId: null,
      employee_id: null,
      purchase_date: new Date(),
      items: [],
      subtotal: 0,
      discount: 0,
      tax: 0,
      total: 0,
      paid_amount: 0,
      status: 'معلقة',
    };
    this.editingPurchaseId = null;
  }
}
