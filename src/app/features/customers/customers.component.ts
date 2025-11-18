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
      { 
        header: 'له (دائن)', 
        field: 'credit',
        valueGetter: (row: any) => (row.balance < 0 ? Math.abs(row.balance) : 0),
        formatter: (value: number) => value > 0 ? value.toFixed(2) : '0'
      },
      { 
        header: 'عليه (مدين)', 
        field: 'debit',
        valueGetter: (row: any) => (row.balance > 0 ? row.balance : 0),
        formatter: (value: number) => value > 0 ? value.toFixed(2) : '0'
      },
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
      const customers = await this.dbService.getAllCustomers();
      this.data = customers.map((customer: any) => ({
        ...customer,
        credit: customer.balance < 0 ? Math.abs(customer.balance) : 0,
        debit: customer.balance > 0 ? customer.balance : 0,
      }));
      console.log('Loaded customers:', this.data);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  }

  showDialog() {
    this.resetForm();
    this.visible = true;
  }

  onEdit(customer: any) {
    console.log('Editing customer:', customer);
    
    // تحديد نوع الرصيد من قيمة ال balance
    const balanceType = customer.balance < 0 ? 'credit' : 'debit';
    const balanceAmount = Math.abs(customer.balance || 0);
    
    this.newCustomer = {
      name: customer.name || '',
      phone: customer.phone || '',
      balanceAmount: balanceAmount,
      balanceType: balanceType,
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
        this.confirmDialog.show({
          message: 'الرجاء إدخال اسم العميل',
          header: 'تنبيه',
          acceptLabel: 'إلغاء',
          rejectLabel: '',
          showReject: false,
        });
        return;
      }

      // Validate Egyptian phone number
      if (!this.validateEgyptianPhone(this.newCustomer.phone)) {
        this.phoneError = 'يجب إدخال رقم مصري مكون من 11 رقم يبدأ بـ 01';
        return;
      }

      this.phoneError = '';

      // إرسال البيانات بالشكل الجديد
      const customerData = {
        name: this.newCustomer.name,
        phone: this.newCustomer.phone,
        balanceType: this.newCustomer.balanceType,
        balanceAmount: this.newCustomer.balanceAmount
      };

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