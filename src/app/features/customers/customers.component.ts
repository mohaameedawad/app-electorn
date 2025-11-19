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
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-customers',
  standalone: true,
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    TableComponent,
    ConfirmationDialogComponent,
    DialogModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule,
    SelectModule,
  ],
})
export class CustomersComponent implements OnInit {
  @ViewChild(ConfirmationDialogComponent)
  confirmDialog!: ConfirmationDialogComponent;

  columns: any[] = [];
  data: any[] = [];
  visible: boolean = false;
  editingCustomerId: number | null = null;
  phoneError: string = '';

  balanceTypes = [
    { label: 'له (دائن)', value: 'credit' },
    { label: 'عليه (مدين)', value: 'debit' },
  ];

  newCustomer = {
    name: '',
    phone: '',
    balanceAmount: 0,
    balanceType: 'debit',
  };

  constructor(private dbService: DatabaseService) {}

  async ngOnInit() {
    this.columns = [
      { header: 'رقم', field: 'id' },
      { header: 'الاسم', field: 'name' },
      { header: 'التليفون', field: 'phone' },
      { header: 'له (دائن)', field: 'credit' },
      { header: 'عليه (مدين)', field: 'debit' },
      {
        header: 'إجراءات',
        field: 'actions',
        type: 'actions',
        actions: ['edit', 'delete'],
      },
    ];

    await this.loadCustomers();
  }

  async loadCustomers() {
    try {
      const customers = await this.dbService.getCustomers();

      this.data = customers.map((customer: any) => {
        const balance = customer.balance || 0;

        return {
          ...customer,
          credit: balance < 0 ? Math.abs(balance) : 0,
          debit: balance > 0 ? balance : 0,
        };
      });
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  }

  showDialog() {
    this.resetForm();
    this.visible = true;
  }

  onEdit(customer: any) {
    // Determine balance type and amount from existing data
    const hasCredit = customer.credit && customer.credit > 0;
    const hasDebit = customer.debit && customer.debit > 0;

    this.newCustomer = {
      name: customer.name || '',
      phone: customer.phone || '',
      balanceAmount: hasCredit
        ? customer.credit
        : hasDebit
        ? customer.debit
        : 0,
      balanceType: hasCredit ? 'credit' : 'debit',
    };
    this.editingCustomerId = customer.id;
    this.visible = true;
  }

  async onDelete(customer: any) {
    this.confirmDialog.show({
      message: `هل أنت متأكد من حذف العميل "${customer.name}"؟`,
      header: 'تأكيد الحذف',
      acceptLabel: 'حذف',
      rejectLabel: 'إلغاء',
      accept: async () => {
        try {
          await this.dbService.deleteCustomer(customer.id);
          await this.loadCustomers();
        } catch (error) {
          console.error('Error deleting customer:', error);
        }
      },
    });
  }

  async saveCustomer() {
  try {
    if (!this.newCustomer.name) {
      // ... existing validation
    }

    // Validate Egyptian phone number
    if (!this.validateEgyptianPhone(this.newCustomer.phone)) {
      this.phoneError = 'يجب إدخال رقم مصري مكون من 11 رقم يبدأ بـ 01';
      return;
    }

    this.phoneError = '';

    // 🔹 حساب balance من النوع والمبلغ
    const balance = this.newCustomer.balanceType === 'debit' 
      ? this.newCustomer.balanceAmount 
      : -this.newCustomer.balanceAmount;

    const customerData = {
      name: this.newCustomer.name,
      phone: this.newCustomer.phone,
      debit: this.newCustomer.balanceType === 'debit' ? this.newCustomer.balanceAmount : 0,
      credit: this.newCustomer.balanceType === 'credit' ? this.newCustomer.balanceAmount : 0,
      balance: balance // 🔹 إضافة balance
    };

    console.log('💾 حفظ بيانات العميل:', {
      editingCustomerId: this.editingCustomerId,
      customerData: customerData
    });

    if (this.editingCustomerId) {
      await this.dbService.updateCustomer(this.editingCustomerId, customerData);
    } else {
      await this.dbService.addCustomer(customerData);
    }

    await this.loadCustomers();
    this.closeDialog();
  } catch (error) {
    console.error('Error saving customer:', error);
  }
}

  validateEgyptianPhone(phone: string): boolean {
    // Egyptian phone number: 11 digits starting with 01
    const phoneRegex = /^01[0-9]{9}$/;
    return phoneRegex.test(phone);
  }

  closeDialog() {
    this.visible = false;
    this.phoneError = '';
    this.resetForm();
  }

  onDialogHide() {
    this.phoneError = '';
    this.resetForm();
  }

  resetForm() {
    this.newCustomer = {
      name: '',
      phone: '',
      balanceAmount: 0,
      balanceType: 'debit',
    };
    this.editingCustomerId = null;
  }
}
