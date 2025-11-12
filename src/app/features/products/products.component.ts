import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '../../shared/components/table/table.component';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { DatabaseService } from '../../services/database.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    TableComponent,
    ConfirmationDialogComponent,
    DialogModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  @ViewChild(ConfirmationDialogComponent) confirmDialog!: ConfirmationDialogComponent;
  
  columns: any[] = [];
  products: any[] = [];
  visible: boolean = false;
  editingProductId: number | null = null;

  newProduct = {
    name: '',
    purchase_price: 0,
    sale_price: 0,
    stock: 0,
    category: ''
  };

  constructor(private dbService: DatabaseService) {}

  async ngOnInit() {
    this.columns = [
      { field: 'name', header: 'اسم المنتج' },
      { field: 'purchase_price', header: 'سعر الشراء' },
      { field: 'sale_price', header: 'سعر البيع' },
      { field: 'stock', header: 'المخزون' },
      { field: 'category', header: 'الفئة' },
      { header: 'إجراءات', field: 'actions', type: 'actions', actions: ['edit', 'delete'] }
    ];

    await this.loadProducts();
  }

  async loadProducts() {
    this.products = await this.dbService.getProducts();
  }

  showDialog() {
    this.resetForm();
    this.visible = true;
  }

  onEdit(product: any) {
    this.newProduct = {
      name: product.name || '',
      purchase_price: product.purchase_price || product.price || 0,
      sale_price: product.sale_price || product.price || 0,
      stock: product.stock || 0,
      category: product.category || ''
    };
    this.editingProductId = product.id;
    this.visible = true;
  }

  async onDelete(product: any) {
    this.confirmDialog.show({
      message: `هل أنت متأكد من حذف المنتج "${product.name}"؟`,
      header: 'تأكيد الحذف',
      acceptLabel: 'حذف',
      rejectLabel: 'إلغاء',
      accept: async () => {
        try {
          await this.dbService.deleteProduct(product.id);
          await this.loadProducts();
        } catch (error) {
          console.error('Error deleting product:', error);
        }
      }
    });
  }

  async saveProduct() {
    try {
      if (!this.newProduct.name) {
        this.confirmDialog.show({
          message: 'الرجاء إدخال اسم المنتج',
          header: 'تنبيه',
          acceptLabel: 'إلغاء',
          showReject: false
        });
        return;
      }

      const productData = {
        name: this.newProduct.name,
        purchase_price: this.newProduct.purchase_price,
        sale_price: this.newProduct.sale_price,
        price: this.newProduct.sale_price, // للتوافق مع الكود القديم
        stock: this.newProduct.stock,
        category: this.newProduct.category
      };

      if (this.editingProductId) {
        await this.dbService.updateProduct(this.editingProductId, productData);
      } else {
        await this.dbService.addProduct(productData);
      }

      await this.loadProducts();
      this.closeDialog();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  }

  closeDialog() {
    this.visible = false;
    this.resetForm();
  }

  onDialogHide() {
    this.resetForm();
  }

  resetForm() {
    this.newProduct = {
      name: '',
      purchase_price: 0,
      sale_price: 0,
      stock: 0,
      category: ''
    };
    this.editingProductId = null;
  }
}