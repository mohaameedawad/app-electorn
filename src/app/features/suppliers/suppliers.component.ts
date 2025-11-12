import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '../../shared/components/table/table.component';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { DatabaseService } from '../../services/database.service';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-suppliers',
  imports: [
    CommonModule,
    FormsModule,
    TableComponent,
    DialogComponent,
    InputTextModule,
    InputNumberModule,
    ButtonModule
  ],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss'
})
export class SuppliersComponent implements OnInit {
  columns = [
    { header: 'رقم', field: 'id' },
    { header: 'اسم المورد', field: 'name' },
    { header: 'التليفون', field: 'phone' },
    { header: 'العنوان', field: 'address' },
    { header: 'له (دائن)', field: 'credit' },
    { header: 'عليه (مدين)', field: 'debit' },
  ];

  data: any[] = [];
  visible: boolean = false;
  newSupplier = {
    name: '',
    phone: '',
    address: '',
    debit: 0,
    credit: 0
  };

  constructor(private dbService: DatabaseService) {}

  async ngOnInit() {
    await this.loadSuppliers();
  }

  async loadSuppliers() {
    this.data = await this.dbService.getSuppliers();
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.resetForm();
  }

  async saveSupplier() {
    try {
      await this.dbService.addSupplier(this.newSupplier);
      await this.loadSuppliers();
      this.closeDialog();
    } catch (error) {
      console.error('Error saving supplier:', error);
    }
  }

  resetForm() {
    this.newSupplier = {
      name: '',
      phone: '',
      address: '',
      debit: 0,
      credit: 0
    };
  }
}
