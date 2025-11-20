import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';

import { DatabaseService } from '../../services/database.service';
import { TableComponent } from '../../shared/components/table/table.component';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';

interface SupplierPayment {
  id?: number;
  receiptNumber: string;
  supplierId?: number;
  supplier_name?: string;
  date: Date;
  amount: number;
}

@Component({
  selector: 'app-suppliers-payments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    DatePickerModule,
    TableComponent,
    ButtonModule,
    CalendarModule,
    DialogComponent,
    ConfirmationDialogComponent,
  ],
  templateUrl: './suppliers-payments.component.html',
  styleUrl: './suppliers-payments.component.scss',
})
export class SuppliersPaymentsComponent implements OnInit {
  @ViewChild(ConfirmationDialogComponent)
  confirmDialog!: ConfirmationDialogComponent;

  payments: SupplierPayment[] = [];
  suppliers: any[] = [];
  displayDialog = false;
  payment: SupplierPayment = this.getEmptyPayment();
  isEditMode = false;

  columns = [
    { field: 'receiptNumber', header: 'رقم سند الدفع' },
    { field: 'supplier_name', header: 'اسم المورد' },
    { field: 'date', header: 'التاريخ', type: 'date' },
    { field: 'amount', header: 'المبلغ' },
    {
      field: 'actions',
      header: 'الإجراءات',
      type: 'actions',
      actions: ['edit', 'delete'],
    },
  ];

  constructor(private dbService: DatabaseService) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    try {
      this.payments = await this.dbService.getSupplierPayments();
      this.suppliers = await this.dbService.getSuppliers();

      this.payments = this.payments.map((payment) => {
        if (payment.supplierId) {
          const supplier = this.suppliers.find(
            (s) => s.id === payment.supplierId
          );
          return {
            ...payment,
            supplier_name: supplier ? supplier.name : 'غير معروف',
          };
        }
        return payment;
      });
    } catch (error) {
      console.error('Error loading supplier payments:', error);
    }
  }

  getEmptyPayment(): SupplierPayment {
    const nextNumber = this.generateReceiptNumber();
    return {
      receiptNumber: nextNumber,
      supplierId: undefined,
      date: new Date(),
      amount: 0,
    };
  }

  generateReceiptNumber(): string {
    const maxId =
      this.payments.length > 0
        ? Math.max(...this.payments.map((p) => p.id || 0))
        : 0;
    return String(maxId + 1);
  }

  showAddDialog() {
    this.payment = this.getEmptyPayment();
    this.isEditMode = false;
    this.displayDialog = true;
  }

  editPayment(payment: SupplierPayment) {
    this.payment = { ...payment };
    this.isEditMode = true;
    this.displayDialog = true;
  }

  async deletePayment(payment: SupplierPayment) {
    this.confirmDialog.show({
      message: `هل أنت متأكد من حذف سند الدفع رقم "${payment.receiptNumber}"؟`,
      header: 'تأكيد الحذف',
      acceptLabel: 'حذف',
      rejectLabel: 'إلغاء',
      accept: async () => {
        try {
          await this.dbService.deleteSupplierPayment(payment.id!);
          await this.loadData();
        } catch (error) {
          console.error('Error deleting supplier payment:', error);
        }
      },
    });
  }

  async savePayment() {
    try {
      if (!this.payment.supplierId || this.payment.amount <= 0) {
        alert('يرجى اختيار مورد وإدخال مبلغ صحيح');
        return;
      }

      const data = {
        receiptNumber: this.payment.receiptNumber,
        supplierId: this.payment.supplierId,
        date: this.formatDate(this.payment.date),
        amount: this.payment.amount,
        type: 'paid',
      };

      if (this.isEditMode) {
        await this.dbService.updateSupplierPayment(this.payment.id!, data);
      } else {
        await this.dbService.addSupplierPayment(data);
      }

      this.displayDialog = false;
      await this.loadData();
    } catch (error) {
      console.error('Error saving supplier payment:', error);
    }
  }

  formatDate(date: any): string {
    const d = new Date(date);

    if (isNaN(d.getTime())) return '';

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  hideDialog() {
    this.displayDialog = false;
  }
}
