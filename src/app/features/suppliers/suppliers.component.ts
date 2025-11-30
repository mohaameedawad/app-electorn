import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '../../shared/components/table/table.component';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { DatabaseService } from '../../services/database.service';
import { DialogModule } from 'primeng/dialog'; // 🔹 إضافة DialogModule
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-suppliers',
  imports: [
    CommonModule,
    FormsModule,
    TableComponent,
    ConfirmationDialogComponent,
    DialogModule, // 🔹 إضافة DialogModule هنا
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    SelectModule,
  ],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss',
})
export class SuppliersComponent implements OnInit {
  @ViewChild(ConfirmationDialogComponent)
  confirmDialog!: ConfirmationDialogComponent;

  columns = [
    { header: 'رقم', field: 'id' },
    { header: 'اسم المورد', field: 'name' },
    { header: 'التليفون', field: 'phone' },
    { header: 'العنوان', field: 'address' },
    {
      header: 'إجراءات',
      field: 'actions',
      type: 'actions',
      actions: ['edit', 'delete'],
    },
  ];

  data: any[] = [];
  visible: boolean = false;
  phoneError: string = '';
  editingSupplierId: number | null = null;

  balanceTypes = [
    { label: 'له (دائن)', value: 'credit' },
    { label: 'عليه (مدين)', value: 'debit' },
  ];

  newSupplier = {
    name: '',
    phone: '',
    address: '',
    balanceAmount: 0,
    balanceType: 'credit',
  };

  constructor(private dbService: DatabaseService) {}

  async ngOnInit() {
    await this.loadSuppliers();
  }

  async loadSuppliers() {
    const suppliers = await this.dbService.getSuppliers();
    this.data = suppliers.map((s: any) => ({
      ...s,
      credit: s.balance > 0 ? s.balance : 0,
      debit: s.balance < 0 ? Math.abs(s.balance) : 0,
    }));
  }

  showDialog() {
    this.resetForm();
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.phoneError = '';
    this.resetForm();
  }

  onEdit(supplier: any) {
    console.log('Editing supplier:', supplier);
    
    // Determine balance type and amount from existing data
    const hasCredit = supplier.credit && supplier.credit > 0;
    const hasDebit = supplier.debit && supplier.debit > 0;

    this.newSupplier = {
      name: supplier.name || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
      balanceAmount: hasCredit
        ? supplier.credit
        : hasDebit
        ? supplier.debit
        : 0,
      balanceType: hasCredit ? 'credit' : 'debit',
    };
    this.editingSupplierId = supplier.id;
    this.visible = true;
  }

  async onDelete(supplier: any) {
    console.log('Deleting supplier:', supplier);
    
    this.confirmDialog.show({
      message: `هل أنت متأكد من حذف المورد "${supplier.name}"؟`,
      header: 'تأكيد الحذف',
      acceptLabel: 'حذف',
      rejectLabel: 'إلغاء',
      accept: async () => {
        try {
          await this.dbService.deleteSupplier(supplier.id);
          await this.loadSuppliers();
        } catch (error) {
          console.error('Error deleting supplier:', error);
        }
      },
    });
  }

  async saveSupplier() {
    try {
      // Validate required fields
      if (!this.newSupplier.name) {
        console.error('Name is required');
        return;
      }

      // Validate Egyptian phone number
      if (!this.validateEgyptianPhone(this.newSupplier.phone)) {
        this.phoneError = 'يجب إدخال رقم مصري مكون من 11 رقم يبدأ بـ 01';
        return;
      }

      this.phoneError = '';

      const supplierData = {
        name: this.newSupplier.name,
        phone: this.newSupplier.phone,
        address: this.newSupplier.address,
        balance:
          this.newSupplier.balanceType === 'credit'
            ? this.newSupplier.balanceAmount
            : -this.newSupplier.balanceAmount,
      };

      console.log('💾 حفظ بيانات المورد:', {
        editingSupplierId: this.editingSupplierId,
        supplierData: supplierData
      });

      if (this.editingSupplierId) {
        await this.dbService.updateSupplier(this.editingSupplierId, supplierData);
      } else {
        await this.dbService.addSupplier(supplierData);
      }

      await this.loadSuppliers();
      this.closeDialog();
    } catch (error) {
      console.error('Error saving supplier:', error);
    }
  }

  validateEgyptianPhone(phone: string): boolean {
    const phoneRegex = /^01[0-9]{9}$/;
    return phoneRegex.test(phone);
  }

  resetForm() {
    this.newSupplier = {
      name: '',
      phone: '',
      address: '',
      balanceAmount: 0,
      balanceType: 'credit',
    };
    this.editingSupplierId = null;
  }

  onDialogHide() {
    this.phoneError = '';
    this.resetForm();
  }
}