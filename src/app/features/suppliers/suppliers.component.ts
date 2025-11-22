import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '../../shared/components/table/table.component';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { DatabaseService } from '../../services/database.service';
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
    DialogComponent,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    SelectModule,
  ],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss',
})
export class SuppliersComponent implements OnInit {
  columns = [
    { header: 'رقم', field: 'id' },
    { header: 'اسم المورد', field: 'name' },
    { header: 'التليفون', field: 'phone' },
    { header: 'العنوان', field: 'address' },
    // { header: 'له (دائن)', field: 'credit' },
    // { header: 'عليه (مدين)', field: 'debit' },
  ];

  data: any[] = [];
  visible: boolean = false;
  phoneError: string = '';

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
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.phoneError = '';
    this.resetForm();
  }

  async saveSupplier() {
    try {
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

      await this.dbService.addSupplier(supplierData);
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
  }
}
