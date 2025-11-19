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
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss',
})
export class PaymentsComponent implements OnInit {
  @ViewChild(ConfirmationDialogComponent)
  confirmDialog!: ConfirmationDialogComponent;

  payments: Payment[] = [];
  customers: any[] = [];
  displayDialog = false;
  payment: Payment = this.getEmptyPayment();
  isEditMode = false;

  columns = [
    { field: 'receiptNumber', header: 'رقم سند القبض' },
    { field: 'customerId', header: 'اسم العميل', type: 'customer' },
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
      this.payments = await this.dbService.getPayments();
      this.customers = await this.dbService.getCustomers();
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
          await this.dbService.deletePayment(payment.id!);
          await this.loadData();
        } catch (error) {
          console.error('Error deleting payment:', error);
        }
      },
    });
  }

  async savePayment() {
    try {
      if (this.isEditMode) {
        await this.dbService.updatePayment(this.payment.id!, this.payment);
      } else {
        await this.dbService.addPayment(this.payment);
      }
      this.displayDialog = false;
      await this.loadData();
    } catch (error) {
      console.error('Error saving payment:', error);
    }
  }

  hideDialog() {
    this.displayDialog = false;
  }
}
