import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { DatabaseService } from '../../services/database.service';
import { TableComponent } from '../../shared/components/table/table.component';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';

interface Payment {
  id?: number;
  receiptNumber: string;
  customerId?: number;
  customer_name?: string;
  date: Date;
  amount: number;
}

@Component({
  selector: 'app-payments',
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
  templateUrl: './customers-payments.component.html',
  styleUrls: ['./customers-payments.component.scss'],
})
export class CustomersPaymentsComponent implements OnInit {
  @ViewChild(ConfirmationDialogComponent)
  confirmDialog!: ConfirmationDialogComponent;

  payments: Payment[] = [];
  customers: any[] = [];
  displayDialog = false;
  payment: Payment = this.getEmptyPayment();
  isEditMode = false;

  columns = [
    { field: 'receiptNumber', header: 'رقم سند القبض' },
    { field: 'customer_name', header: 'اسم العميل' },
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
      this.payments = await this.dbService.getCustomerPayments();
      this.customers = await this.dbService.getCustomers();

      this.payments = this.payments.map((payment) => {
        if (payment.customerId) {
          const customer = this.customers.find(
            (c) => c.id === payment.customerId
          );
          return {
            ...payment,
            customer_name: customer ? customer.name : 'غير معروف',
          };
        }
        return payment;
      });
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  getEmptyPayment(): Payment {
    const nextNumber = this.generateReceiptNumber();
    return {
      receiptNumber: nextNumber,
      customerId: undefined,
      date: new Date(),
      amount: 0,
    };
  }

  generateReceiptNumber(): string {
    const maxId =
      this.payments.length > 0
        ? Math.max(...this.payments.map((p) => p.id || 0))
        : 0;
    const nextId = maxId + 1;
    return String(nextId);
  }

  showAddDialog() {
    this.payment = this.getEmptyPayment();
    this.isEditMode = false;
    this.displayDialog = true;
  }

  editPayment(payment: Payment) {
    this.payment = { ...payment };
    this.isEditMode = true;
    this.displayDialog = true;
  }

  async deletePayment(payment: Payment) {
    this.confirmDialog.show({
      message: `هل أنت متأكد من حذف سند القبض رقم "${payment.receiptNumber}"؟`,
      header: 'تأكيد الحذف',
      acceptLabel: 'حذف',
      rejectLabel: 'إلغاء',
      accept: async () => {
        try {
          await this.dbService.deleteCustomerPayment(payment.id!);
          await this.loadData();
        } catch (error) {
          console.error('Error deleting payment:', error);
        }
      },
    });
  }

  async savePayment() {
    try {
      // التحقق من البيانات
      if (!this.payment.customerId || this.payment.amount <= 0) {
        alert('يرجى اختيار عميل وإدخال مبلغ صحيح');
        return;
      }

      const paymentData = {
        receiptNumber: this.payment.receiptNumber,
        customerId: this.payment.customerId,
        date: this.formatDate(this.payment.date),
        amount: this.payment.amount,
        type: 'received',
      };

      if (this.isEditMode) {
        await this.dbService.updateCustomerPayment(this.payment.id!, paymentData);
      } else {
        await this.dbService.addCustomerPayment(paymentData);
      }
      this.displayDialog = false;
      await this.loadData();
    } catch (error) {
      console.error('Error saving payment:', error);
      alert('حدث خطأ أثناء حفظ سند القبض');
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  hideDialog() {
    this.displayDialog = false;
  }
}
