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
import { TableModule } from "primeng/table";

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
    TableModule
  ],
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.scss'
})
export class PurchasesComponent implements OnInit {
  @ViewChild(ConfirmationDialogComponent) confirmDialog!: ConfirmationDialogComponent;
  
  columns = [
    { header: 'رقم الفاتورة', field: 'invoice_no' },
    { header: 'التاريخ', field: 'purchase_date' },
    { header: 'المورد', field: 'supplier' },
    { header: 'الإجمالي', field: 'total' },
    { header: 'الحالة', field: 'status' },
    { header: 'إجراءات', field: 'actions', type: 'actions', actions: ['edit', 'delete', 'preview', 'print'] }
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
    supplier_id: null,
    employee_id: null,
    purchase_date: new Date(),
    items: [] as any[],
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
    paid_amount: 0,
    status: 'معلقة'
  };

  // الصنف الحالي قيد الإضافة
  currentItem = {
    product_id: null,
    quantity: 1,
    price: 0,
    total: 0
  };

  // Preview purchase data
  previewPurchase: any = {
    invoice_no: null,
    supplier_id: null,
    purchase_date: new Date(),
    items: [],
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
    paid_amount: 0,
    status: 'معلقة'
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
    this.products = productsList.map((p:any) => ({ 
      label: p.name, 
      value: p.id, 
      price: p.purchase_price || p.price || 0 
    }));
  }

  async loadSuppliers() {
    const suppliersList = await this.dbService.getSuppliers();
    this.suppliers = suppliersList.map((s:any) => ({ label: s.name, value: s.id }));
  }

  async loadEmployees() {
    const employeesList = await this.dbService.getEmployees();
    this.employees = employeesList.map((e:any) => ({ label: e.name, value: e.id }));
  }

generateInvoiceNumber() {
    const lastInvoice = this.data.length > 0 ? this.data[this.data.length - 1].invoice_no : 0;
    this.newPurchase.invoice_no = lastInvoice + 1;
  }

  // handle edit action from table
  async onEdit(purchase: any) {
    // bind data to form and open dialog
    // load full purchase data (items may be stored as JSON string)
    const purchaseCopy: any = { ...purchase };
    try {
      purchaseCopy.items = typeof purchaseCopy.items === 'string' ? JSON.parse(purchaseCopy.items) : (purchaseCopy.items || []);
    } catch (err) {
      purchaseCopy.items = purchaseCopy.items || [];
    }

    this.newPurchase = {
      invoice_no: purchaseCopy.invoice_no || 0,
      supplier_id: purchaseCopy.supplier_id || null,
      employee_id: purchaseCopy.employee_id || null,
      purchase_date: purchaseCopy.purchase_date ? new Date(purchaseCopy.purchase_date) : new Date(),
      items: purchaseCopy.items || [],
      subtotal: purchaseCopy.subtotal || 0,
      discount: purchaseCopy.discount || 0,
      tax: purchaseCopy.tax || 0,
      total: purchaseCopy.total || 0,
      paid_amount: purchaseCopy.paid_amount || 0,
      status: purchaseCopy.status || 'معلقة'
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
      }
    });
  }

  // handle preview action from table
  async onPreview(purchase: any) {
    // Parse items if stored as JSON string
    const purchaseCopy: any = { ...purchase };
    try {
      purchaseCopy.items = typeof purchaseCopy.items === 'string' ? JSON.parse(purchaseCopy.items) : (purchaseCopy.items || []);
    } catch (err) {
      purchaseCopy.items = purchaseCopy.items || [];
    }

    this.previewPurchase = {
      invoice_no: purchaseCopy.invoice_no || 0,
      supplier_id: purchaseCopy.supplier_id || null,
      purchase_date: purchaseCopy.purchase_date ? new Date(purchaseCopy.purchase_date) : new Date(),
      items: purchaseCopy.items || [],
      subtotal: purchaseCopy.subtotal || 0,
      discount: purchaseCopy.discount || 0,
      tax: purchaseCopy.tax || 0,
      total: purchaseCopy.total || 0,
      paid_amount: purchaseCopy.paid_amount || 0,
      status: purchaseCopy.status || 'معلقة'
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
        showReject: false
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
            /* use printer-friendly neutral colors for preview */
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

  // Get supplier name by ID
  getSupplierName(supplierId: any): string {
    const supplier = this.suppliers.find(s => s.value === supplierId);
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
    const selectedProduct = this.products.find(p => p.value === this.currentItem.product_id);
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
    if (!this.currentItem.product_id || !this.currentItem.quantity || this.currentItem.quantity <= 0 || !this.currentItem.price || this.currentItem.price <= 0) {
      this.showValidationErrors = true;
      return;
    }

    this.showValidationErrors = false;
    const product = this.products.find(p => p.value === this.currentItem.product_id);
    this.newPurchase.items.push({
      product_id: this.currentItem.product_id,
      product_name: product?.label || '',
      quantity: this.currentItem.quantity,
      price: this.currentItem.price,
      total: this.currentItem.total
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
    this.newPurchase.subtotal = this.newPurchase.items.reduce((sum, item) => sum + item.total, 0);
    // discount is now an absolute number (not percentage)
    const discountAmount = Number(this.newPurchase.discount) || 0;
    const afterDiscount = Math.max(0, this.newPurchase.subtotal - discountAmount);
    const taxAmount = (afterDiscount * (Number(this.newPurchase.tax) || 0)) / 100;
    this.newPurchase.total = afterDiscount + taxAmount;
  }

  resetCurrentItem() {
    this.currentItem = {
      product_id: null,
      quantity: 1,
      price: 0,
      total: 0
    };
    this.showValidationErrors = false;
  }

  async savePurchase() {
    try {
      if (this.newPurchase.items.length === 0) {
        this.confirmDialog.show({
          message: 'يجب إضافة صنف واحد على الأقل',
          header: 'تنبيه',
          acceptLabel: 'إلغاء',
          showReject: false
        });
        return;
      }

      const supplier = this.suppliers.find((s: any) => s.value === this.newPurchase.supplier_id);
      const purchaseData = {
        invoice_no: this.newPurchase.invoice_no,
        supplier_id: this.newPurchase.supplier_id,
        supplier: supplier?.label || '',
        employee_id: this.newPurchase.employee_id,
        items: JSON.stringify(this.newPurchase.items),
        subtotal: this.newPurchase.subtotal,
        discount: this.newPurchase.discount,
        tax: this.newPurchase.tax,
        total: this.newPurchase.total,
        paid_amount: this.newPurchase.paid_amount,
        status: this.newPurchase.status,
        purchase_date: this.formatDate(this.newPurchase.purchase_date)
      };

      if (this.editingPurchaseId) {
        // update existing
        await this.dbService.updatePurchase(this.editingPurchaseId, purchaseData);
      } else {
        await this.dbService.addPurchase(purchaseData);
      }
      await this.loadPurchases();
      
      // Save current purchase data for preview
      this.previewPurchase = { ...this.newPurchase };
      
      // Close main dialog
      this.visible = false;
      
      // Reset form
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
      supplier_id: null,
      employee_id: null,
      purchase_date: new Date(),
      items: [],
      subtotal: 0,
      discount: 0,
      tax: 0,
      total: 0,
      paid_amount: 0,
      status: 'معلقة'
    };
    this.editingPurchaseId = null;
  }
}
