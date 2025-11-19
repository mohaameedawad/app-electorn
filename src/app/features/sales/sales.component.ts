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
  selector: 'app-sales',
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
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss',
})
export class SalesComponent implements OnInit {
  @ViewChild(ConfirmationDialogComponent)
  confirmDialog!: ConfirmationDialogComponent;

  columns = [
    { header: 'رقم الفاتورة', field: 'invoice_no' },
    { header: 'التاريخ', field: 'sale_date' },
    { header: 'العميل', field: 'customer' },
    { header: 'الإجمالي', field: 'total' },
    { header: 'المدفوع', field: 'paid_amount' },
    { header: 'المتبقي', field: 'remaining_amount' },
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
  // when editing an existing sale, keep its id here
  editingSaleId: number | null = null;

  // Company information for invoice
  companyName: string = 'Luvi';
  companyPhone: string = '01070121737';
  showCreditWarning: boolean = false;
  customerCreditLimit: number = 0;
  currentCustomerBalance: number = 0;

  // بيانات الفاتورة الجديدة
  newSale = {
    invoice_no: 0,
    customer_id: null,
    employee_id: null,
    sale_date: new Date(),
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

  // Preview sale data
  previewSale: any = {
    invoice_no: 0,
    customer_id: null,
    sale_date: new Date(),
    items: [],
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
    paid_amount: 0,
    status: 'معلقة',
  };

  products: any[] = [];
  customers: any[] = [];
  employees: any[] = [];
  showValidationErrors: boolean = false;

  constructor(private dbService: DatabaseService) {}

  async ngOnInit() {
    await this.loadSales();
    await this.loadProducts();
    await this.loadCustomers();
    await this.loadEmployees();
    this.generateInvoiceNumber();
  }

  async loadSales() {
    this.data = await this.dbService.getSales();
  }

  async loadProducts() {
    const productsList = await this.dbService.getProducts();
    this.products = productsList.map((p: any) => ({
      label: p.name,
      value: p.id,
      price: p.sale_price || p.price || 0,
    }));
  }

  async loadCustomers() {
    const customersList = await this.dbService.getCustomers();
    this.customers = customersList.map((c: any) => ({
      label: c.name,
      value: c.id,
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
    this.newSale.invoice_no = lastInvoice + 1;
  }

  // handle edit action from table
  async onEdit(sale: any) {
    // bind data to form and open dialog
    // load full sale data (items may be stored as JSON string)
    const saleCopy: any = { ...sale };
    try {
      saleCopy.items =
        typeof saleCopy.items === 'string'
          ? JSON.parse(saleCopy.items)
          : saleCopy.items || [];
    } catch (err) {
      saleCopy.items = saleCopy.items || [];
    }

    this.newSale = {
      invoice_no: saleCopy.invoice_no || 0,
      customer_id: saleCopy.customer_id || null,
      employee_id: saleCopy.employee_id || null,
      sale_date: saleCopy.sale_date ? new Date(saleCopy.sale_date) : new Date(),
      items: saleCopy.items || [],
      subtotal: saleCopy.subtotal || 0,
      discount: saleCopy.discount || 0,
      tax: saleCopy.tax || 0,
      total: saleCopy.total || 0,
      paid_amount: saleCopy.paid_amount || 0,
      status: saleCopy.status || 'معلقة',
    };
    this.editingSaleId = saleCopy.id || null;
    this.visible = true;
  }

  // handle delete action from table
  async onDelete(sale: any) {
    const id = sale?.id;
    if (!id) return;

    this.confirmDialog.show({
      message: `هل أنت متأكد من حذف فاتورة المبيعات رقم "${sale.invoice_no}"؟ `,
      header: 'تأكيد الحذف',
      acceptLabel: 'حذف',
      rejectLabel: 'إلغاء',
      accept: async () => {
        try {
          await this.dbService.deleteSale(id);
          await this.loadSales();
        } catch (err) {
          console.error('Error deleting sale:', err);
        }
      },
    });
  }

  // handle preview action from table
  async onPreview(sale: any) {
    // Parse items if stored as JSON string
    const saleCopy: any = { ...sale };
    try {
      saleCopy.items =
        typeof saleCopy.items === 'string'
          ? JSON.parse(saleCopy.items)
          : saleCopy.items || [];
    } catch (err) {
      saleCopy.items = saleCopy.items || [];
    }

    this.previewSale = {
      invoice_no: saleCopy.invoice_no || 0,
      customer_id: saleCopy.customer_id || null,
      sale_date: saleCopy.sale_date ? new Date(saleCopy.sale_date) : new Date(),
      items: saleCopy.items || [],
      subtotal: saleCopy.subtotal || 0,
      discount: saleCopy.discount || 0,
      tax: saleCopy.tax || 0,
      total: saleCopy.total || 0,
      paid_amount: saleCopy.paid_amount || 0,
      status: saleCopy.status || 'معلقة',
    };
    this.previewVisible = true;
  }

  // handle print action from table
  // async onPrint(sale: any) {
  //   await this.onPreview(sale);
  //   setTimeout(() => {
  //     window.print();
  //   }, 500);
  // }

  // preview current invoice in dialog
  previewInvoice() {
    if (this.newSale.items.length === 0) {
      this.confirmDialog.show({
        message: 'يجب إضافة صنف واحد على الأقل للمعاينة',
        header: 'تنبيه',
        acceptLabel: 'إلغاء',
        showReject: false,
      });
      return;
    }
    this.previewSale = { ...this.newSale };
    this.previewVisible = true;
  }

  // print current invoice in dialog
  printInvoice() {
    this.previewInvoice();
  }

  // Print from preview dialog
  printPreview() {
    // Get the invoice preview element
    const printContent = document.querySelector('.invoice-preview');
    if (!printContent) return;

    // Open window with A4 dimensions (210mm x 297mm at 96 DPI ≈ 794px x 1123px)
    const printWindow = window.open('', '_blank', 'width=850,height=1200');
    if (!printWindow) return;

    // Write the content with styles
    printWindow.document.write(`
      <html dir="rtl">
        <head>
          <title>طباعة الفاتورة</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { 
              width: 210mm; 
              height: 297mm; 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              background: white;
            }
            body { 
              padding: 1.5cm; 
              margin: 0 auto;
              max-width: 210mm;
            }
            .invoice-header { text-align: center; margin-bottom: 1.5rem; }
            .invoice-header h1 { font-size: 1.6rem; font-weight: bold; margin-bottom: 1rem; border-bottom: 3px solid #000; padding-bottom: 0.5rem; }
            .customer-info { margin-bottom: 1.5rem; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
            .info-item { flex: 1; display: flex; gap: 0.5rem; }
            .label { font-weight: 600; min-width: 80px; }
            .preview-table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
            .preview-table thead { background-color: #dddddd; color: #000000; }
            .preview-table th { padding: 0.5rem; text-align: center; font-weight: 600; border: 1px solid #000; font-size: 0.95rem; }
            .preview-table tbody tr:nth-child(even) { background-color: #f9f9f9; }
            .preview-table td { padding: 0.5rem; text-align: center; border: 1px solid #ddd; font-size: 0.9rem; }
            .totals-table { margin-bottom: 1rem; margin-top: 0; }
            .totals-table tbody tr td.total-header { background-color: #dddddd; border: 1px solid #000; font-weight: 700; font-size: 1rem; padding: 0.6rem; text-align: center; }
            .totals-table tbody tr td.total-value { background-color: #f9f9f9; font-weight: 600; font-size: 1rem; border: 1px solid #000; padding: 0.6rem; text-align: center; }
            .totals-table .final-total { font-weight: 700; font-size: 1.1rem; }
            @media print {
              html, body { 
                width: 210mm; 
                height: 297mm; 
              }
              body { padding: 1cm; }
              @page { 
                size: A4; 
                margin: 0; 
              }
            }
            @media screen {
              body {
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                margin: 20px auto;
              }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();

    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }

  // Close preview dialog
  closePreview() {
    this.previewVisible = false;
  }

  // Get customer name by ID
  getCustomerName(customerId: any): string {
    const customer = this.customers.find((c) => c.value === customerId);
    return customer ? customer.label : '';
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

  // async addItem() {
  //   // Validate inputs
  //   if (
  //     !this.currentItem.product_id ||
  //     !this.currentItem.quantity ||
  //     this.currentItem.quantity <= 0 ||
  //     !this.currentItem.price ||
  //     this.currentItem.price <= 0
  //   ) {
  //     this.showValidationErrors = true;
  //     return;
  //   }

  //   // 🔹 التحقق من توفر المخزون
  //   const product = this.products.find(
  //     (p) => p.value === this.currentItem.product_id
  //   );

  //   if (
  //     product &&
  //     product.stock !== undefined &&
  //     product.stock < this.currentItem.quantity
  //   ) {
  //     this.confirmDialog.show({
  //       message: `المخزون غير كافٍ! المتوفر: ${product.stock}، المطلوب: ${this.currentItem.quantity}`,
  //       header: 'تنبيه المخزون',
  //       acceptLabel: 'موافق',
  //       showReject: false,
  //     });
  //     return;
  //   }

  //   this.showValidationErrors = false;

  //   this.newSale.items.push({
  //     product_id: this.currentItem.product_id,
  //     product_name: product?.label || '',
  //     quantity: this.currentItem.quantity,
  //     price: this.currentItem.price,
  //     total: this.currentItem.total,
  //   });

  //   this.calculateInvoiceTotal();
  //   this.resetCurrentItem();
  // }

  async addItem() {
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

    // 🔹 التحقق من توفر المخزون
    const productId = this.currentItem.product_id;
    const requestedQuantity = this.currentItem.quantity;

    try {
      // استدعاء خدمة للتحقق من المخزون
      const stockCheck = await this.dbService.checkProductStock(
        productId,
        requestedQuantity
      );

      if (!stockCheck.available) {
        this.confirmDialog.show({
          message: `المنتج "${stockCheck.productName}" غير متاح بالكمية المطلوبة! 
                 المتوفر: ${stockCheck.availableStock}، 
                 المطلوب: ${requestedQuantity}`,
          header: 'تنبيه المخزون',
          acceptLabel: 'موافق',
          showReject: false,
        });
        return;
      }

      this.showValidationErrors = false;
      const product = this.products.find((p) => p.value === productId);

      this.newSale.items.push({
        product_id: productId,
        product_name: product?.label || '',
        quantity: requestedQuantity,
        price: this.currentItem.price,
        total: this.currentItem.total,
      });

      this.calculateInvoiceTotal();
      this.resetCurrentItem();
    } catch (error) {
      console.error('Error checking stock:', error);
      this.confirmDialog.show({
        message: 'حدث خطأ في التحقق من المخزون',
        header: 'خطأ',
        acceptLabel: 'موافق',
        showReject: false,
      });
    }
  }

  removeItem(index: number) {
    this.newSale.items.splice(index, 1);
    this.calculateInvoiceTotal();
  }

  async updateItemTotal(index: number) {
    const item = this.newSale.items[index];
    const oldQuantity = item.quantity;
    item.total = item.quantity * item.price;

    // 🔹 التحقق من المخزون عند تعديل الكمية
    await this.validateStockOnQuantityChange(index, oldQuantity);
    this.calculateInvoiceTotal();
  }

  async validateStockOnQuantityChange(index: number, oldQuantity: number) {
    const item = this.newSale.items[index];
    const newQuantity = item.quantity;

    if (newQuantity <= oldQuantity) {
      return; // لا حاجة للتحقق إذا كانت الكمية الجديدة أقل أو تساوي
    }

    const quantityDiff = newQuantity - oldQuantity;

    try {
      const stockCheck = await this.dbService.checkProductStock(
        item.product_id,
        newQuantity
      );

      if (!stockCheck.available) {
        this.confirmDialog.show({
          message: `لا يمكن زيادة كمية "${stockCheck.productName}" إلى ${newQuantity}! 
                 المتوفر: ${stockCheck.availableStock}`,
          header: 'تنبيه المخزون',
          acceptLabel: 'موافق',
          showReject: false,
        });

        // إعادة الكمية إلى القيمة السابقة
        item.quantity = oldQuantity;
        item.total = item.quantity * item.price;
        this.calculateInvoiceTotal();
      }
    } catch (error) {
      console.error('Error validating stock on quantity change:', error);
    }
  }

  calculateInvoiceTotal() {
    this.newSale.subtotal = this.newSale.items.reduce(
      (sum, item) => sum + item.total,
      0
    );
    // discount is now an absolute number (not percentage)
    const discountAmount = Number(this.newSale.discount) || 0;
    const afterDiscount = Math.max(0, this.newSale.subtotal - discountAmount);
    const taxAmount = (afterDiscount * (Number(this.newSale.tax) || 0)) / 100;
    this.newSale.total = afterDiscount + taxAmount;
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

  async saveSale() {
    try {
      if (this.newSale.items.length === 0) {
        this.confirmDialog.show({
          message: 'يجب إضافة صنف واحد على الأقل',
          header: 'تنبيه',
          acceptLabel: 'إلغاء',
          showReject: false,
        });
        return;
      }

      const stockValid = await this.validateStockBeforeSave();
      if (!stockValid) {
        return; 
      }

      // 🔹 التحقق من الحد الائتماني النهائي
      if (this.showCreditWarning) {
        const confirm = await new Promise<boolean>((resolve) => {
          this.confirmDialog.show({
            message: `هذا البيع سيتجاوز الحد الائتماني للعميل. الحد: ${
              this.customerCreditLimit
            }, الرصيد المتوقع: ${
              this.currentCustomerBalance + this.getExpectedDebt()
            }`,
            header: 'تنبيه تجاوز الحد الائتماني',
            acceptLabel: 'متابعة',
            rejectLabel: 'إلغاء',
            accept: () => resolve(true),
            reject: () => resolve(false),
          });
        });

        if (!confirm) return;
      }

      const customer = this.customers.find(
        (c: any) => c.value === this.newSale.customer_id
      );

      // 🔹 تحضير بيانات الفاتورة
      const saleData = {
        invoice_no: this.newSale.invoice_no,
        customer_id: this.newSale.customer_id,
        customer: customer?.label || '',
        employee_id: this.newSale.employee_id,
        items: this.newSale.items,
        subtotal: this.newSale.subtotal,
        discount: this.newSale.discount,
        tax: this.newSale.tax,
        total: this.newSale.total,
        paid_amount: this.newSale.paid_amount,
        sale_date: this.formatDate(this.newSale.sale_date),
        status: this.newSale.status || 'معلقة',
      };

      console.log('💾 حفظ بيانات الفاتورة:', {
        editingSaleId: this.editingSaleId,
        items: saleData.items.length,
        saleData: saleData,
      });

      // 🔹 حفظ البيانات
      if (this.editingSaleId) {
        // تحديث الفاتورة الحالية
        console.log('✏️ تحديث الفاتورة رقم:', this.editingSaleId);
        const result = await this.dbService.updateSale(
          this.editingSaleId,
          saleData
        );
        console.log('✅ نتيجة التحديث:', result);
      } else {
        // إضافة فاتورة جديدة
        console.log('➕ إضافة فاتورة جديدة');
        const result = await this.dbService.addSale(saleData);
        console.log('✅ نتيجة الإضافة:', result);
      }

      // 🔹 إعادة تحميل البيانات
      await this.loadSales();

      // حفظ بيانات المعاينة
      this.previewSale = { ...this.newSale };

      // إغلاق النافذة
      this.visible = false;

      // إعادة تعيين النموذج
      this.resetForm();
      this.editingSaleId = null;

      // فتح نافذة المعاينة
      this.previewVisible = true;
    } catch (error) {
      console.error('❌ خطأ في حفظ الفاتورة:', error);
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
    this.newSale = {
      invoice_no: 0,
      customer_id: null,
      employee_id: null,
      sale_date: new Date(),
      items: [],
      subtotal: 0,
      discount: 0,
      tax: 0,
      total: 0,
      paid_amount: 0,
      status: 'معلقة',
    };
    this.editingSaleId = null;
  }
  getExpectedDebt(): number {
    const total = this.newSale.total || 0;
    const paid = this.newSale.paid_amount || 0;
    return Math.max(0, total - paid);
  }

  // 🔹 دالة للتحقق من الحد الائتماني عند تغيير العميل
  onCustomerChange() {
    this.checkCreditLimit();
  }

  // 🔹 دالة للتحقق من الحد الائتماني
  async checkCreditLimit() {
    if (!this.newSale.customer_id) {
      this.showCreditWarning = false;
      return;
    }

    try {
      const customer = this.customers.find(
        (c: any) => c.value === this.newSale.customer_id
      );
      if (customer) {
        this.customerCreditLimit = customer.credit_limit || 0;
        this.currentCustomerBalance = customer.balance || 0;

        const expectedDebt = this.getExpectedDebt();
        const newBalance = this.currentCustomerBalance + expectedDebt;

        this.showCreditWarning =
          this.customerCreditLimit > 0 && newBalance > this.customerCreditLimit;
      }
    } catch (error) {
      console.error('Error checking credit limit:', error);
    }
  }

  onPaidAmountChange() {
    this.calculateInvoiceTotal();
    this.checkCreditLimit();
  }

  async validateStockBeforeSave(): Promise<boolean> {
    if (this.editingSaleId) {
      return await this.validateStockForEdit();
    } else {
      return await this.validateStockForNewSale();
    }
  }

  async validateStockForNewSale(): Promise<boolean> {
    for (const item of this.newSale.items) {
      try {
        const stockCheck = await this.dbService.checkProductStock(
          item.product_id,
          item.quantity
        );

        if (!stockCheck.available) {
          this.confirmDialog.show({
            message: `المنتج "${stockCheck.productName}" غير متاح بالكمية المطلوبة!
                      \n 
                     المتوفر: ${stockCheck.availableStock}،
                       \n 
                     المطلوب: ${item.quantity} \n`,
            header: 'خطأ في المخزون',
            acceptLabel: 'موافق',
            showReject: false,
          });
          return false;
        }
      } catch (error) {
        console.error(
          'Error validating stock for product:',
          item.product_id,
          error
        );
        return false;
      }
    }
    return true;
  }

  async validateStockForEdit(): Promise<boolean> {
    try {
      // جلب الفاتورة القديمة
      const oldSale = await this.dbService.getSaleById(this.editingSaleId!);
      let oldItems = [];

      try {
        oldItems =
          typeof oldSale.items === 'string'
            ? JSON.parse(oldSale.items)
            : oldSale.items || [];
      } catch (error) {
        oldItems = oldSale.items || [];
      }

      // إنشاء map للكميات القديمة
      const oldItemsMap = new Map();
      oldItems.forEach((item: any) => {
        oldItemsMap.set(item.product_id, item.quantity);
      });

      // التحقق من كل صنف في الفاتورة الجديدة
      for (const newItem of this.newSale.items) {
        const oldQuantity = oldItemsMap.get(newItem.product_id) || 0;
        const quantityDiff = newItem.quantity - oldQuantity;

        // إذا كانت الكمية الجديدة أكبر من القديمة، تحقق من المخزون للفرق فقط
        if (quantityDiff > 0) {
          const stockCheck = await this.dbService.checkProductStock(
            newItem.product_id,
            quantityDiff
          );

          if (!stockCheck.available) {
            this.confirmDialog.show({
              message: ` لا يمكن زيادة كمية "${stockCheck.productName} \n"! 
             الكمية الحالية : ${oldQuantity} \n
             الكمية الجديدة: ${newItem.quantity} \n
             الكمية المتاحة للزيادة: ${Math.max(0, stockCheck.availableStock)}`,
              header: 'خطأ في المخزون',
              acceptLabel: 'موافق',
              showReject: false,
            });
            return false;
          }
        }
      }
      return true;
    } catch (error) {
      console.error('Error validating stock for edit:', error);
      return false;
    }
  }
}
