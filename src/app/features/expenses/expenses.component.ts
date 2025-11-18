// import { Component, OnInit, ViewChild } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { DialogModule } from 'primeng/dialog';
// import { InputTextModule } from 'primeng/inputtext';
// import { InputNumberModule } from 'primeng/inputnumber';
// import { SelectModule } from 'primeng/select';
// import { DatePickerModule } from 'primeng/datepicker';
// import { DatabaseService } from '../../services/database.service';
// import { TableComponent } from '../../shared/components/table/table.component';
// import { ButtonModule } from 'primeng/button';
// import { CalendarModule } from 'primeng/calendar';
// import { DialogComponent } from '../../shared/components/dialog/dialog.component';
// import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';


// interface Expense {
//   id?: number;
//   voucherNumber: string;
//   expenseType: string;
//   date: Date;
//   amount: number;
// }

// @Component({
//   selector: 'app-expenses',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     DialogModule,
//     InputTextModule,
//     InputNumberModule,
//     SelectModule,
//     DatePickerModule,
//     TableComponent,
//     ButtonModule,
//     CalendarModule,
//     DialogComponent,
//     ConfirmationDialogComponent
//   ],
//   templateUrl: './expenses.component.html',
//   styleUrl: './expenses.component.scss'
// })
// export class ExpensesComponent implements OnInit {
//   @ViewChild(ConfirmationDialogComponent)
//   confirmDialog!: ConfirmationDialogComponent;

//   expenses: Expense[] = [];
//   displayDialog = false;
//   expense: Expense = this.getEmptyExpense();
//   isEditMode = false;

//   expenseTypes = [
//     { label: 'القبض', value: 'القبض' },
//     { label: 'نقل', value: 'نقل' },
//     { label: 'إيجار', value: 'إيجار' },
//     { label: 'إكرامية', value: 'إكرامية' },
//     { label: 'فواتير مياه وكهرباء وغاز', value: 'فواتير مياه وكهرباء وغاز' }
//   ];

//   columns = [
//     { field: 'voucherNumber', header: 'رقم السند الصرف' },
//     { field: 'expenseType', header: 'نوع المصروف' },
//     { field: 'date', header: 'التاريخ', type: 'date' },
//     { field: 'amount', header: 'المبلغ' },
//     { field: 'actions', header: 'الإجراءات', type: 'actions', actions: ['edit', 'delete'] }
//   ];

//   constructor(private dbService: DatabaseService) {}

//   async ngOnInit() {
//     await this.loadData();
//   }

//   async loadData() {
//     try {
//       this.expenses = await this.dbService.getExpenses();
//     } catch (error) {
//       console.error('Error loading data:', error);
//     }
//   }

//   getEmptyExpense(): Expense {
//     const nextNumber = this.generateVoucherNumber();
//     return {
//       voucherNumber: nextNumber,
//       expenseType: '',
//       date: new Date(),
//       amount: 0
//     };
//   }

//   generateVoucherNumber(): string {
//     const maxId = this.expenses.length > 0 ? Math.max(...this.expenses.map(e => e.id || 0)) : 0;
//     const nextId = maxId + 1;
//     return String(nextId);
//   }

//   showAddDialog() {
//     this.expense = this.getEmptyExpense();
//     this.isEditMode = false;
//     this.displayDialog = true;
//   }

//   editExpense(expense: Expense) {
//     this.expense = { ...expense };
//     this.isEditMode = true;
//     this.displayDialog = true;
//   }


//   async deleteExpense(expense: Expense) {
//     this.confirmDialog.show({
//       message: `هل أنت متأكد من حذف سند الصرف رقم "${expense.voucherNumber}"؟`,
//       header: 'تأكيد الحذف',
//       acceptLabel: 'حذف',
//       rejectLabel: 'إلغاء',
//       accept: async () => {
//         try {
//           await this.dbService.deleteExpense(expense.id!);
//           await this.loadData();
//         } catch (error) {
//           console.error('Error deleting expense:', error);
//         }
//       },
//     });
//   }

//   async saveExpense() {
//     try {
//       if (this.isEditMode) {
//         await this.dbService.updateExpense(this.expense.id!, this.expense);
//       } else {
//         await this.dbService.addExpense(this.expense);
//       }
//       this.displayDialog = false;
//       await this.loadData();
//     } catch (error) {
//       console.error('Error saving expense:', error);
//     }
//   }

//   hideDialog() {
//     this.displayDialog = false;
//   }
// }
