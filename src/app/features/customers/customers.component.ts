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
    InputNumberModule
  ]
})
export class CustomersComponent implements OnInit {
  @ViewChild(ConfirmationDialogComponent) confirmDialog!: ConfirmationDialogComponent;
  
  columns: any[] = [];
  data: any[] = [];
  visible: boolean = false;
  editingCustomerId: number | null = null;

  newCustomer = {
    name: '',
    phone: '',
    debit: 0,
    credit: 0
  };

  constructor(private dbService: DatabaseService) {}

  async ngOnInit() {
    this.columns = [
      { header: 'رقم', field: 'id' },
      { header: 'الاسم', field: 'name' },
      { header: 'التليفون', field: 'phone' },
      { header: 'له (دائن)', field: 'credit' },
      { header: 'عليه (مدين)', field: 'debit' },
      { header: 'إجراءات', field: 'actions', type: 'actions', actions: ['edit', 'delete'] }
    ];
    
    await this.loadCustomers();
  }

  async loadCustomers() {
    try {
      this.data = await this.dbService.getCustomers();
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  }

  showDialog() {
    this.resetForm();
    this.visible = true;
  }

  onEdit(customer: any) {
    this.newCustomer = {
      name: customer.name || '',
      phone: customer.phone || '',
      debit: customer.debit || 0,
      credit: customer.credit || 0
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
      }
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
          showReject: false
        });
        return;
      }

      const customerData = {
        name: this.newCustomer.name,
        phone: this.newCustomer.phone,
        debit: this.newCustomer.debit,
        credit: this.newCustomer.credit
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

  closeDialog() {
    this.visible = false;
    this.resetForm();
  }

  onDialogHide() {
    this.resetForm();
  }

  resetForm() {
    this.newCustomer = {
      name: '',
      phone: '',
      debit: 0,
      credit: 0
    };
    this.editingCustomerId = null;
  }
}
