// import { Component, OnInit, ViewChild } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { TableComponent } from '../../shared/components/table/table.component';
// import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
// import { DatabaseService } from '../../services/database.service';
// import { DialogModule } from 'primeng/dialog';
// import { InputTextModule } from 'primeng/inputtext';
// import { ButtonModule } from 'primeng/button';
// import { DialogComponent } from '../../shared/components/dialog/dialog.component';

// @Component({
//   selector: 'app-employees',
//   imports: [
//     CommonModule,
//     FormsModule,
//     TableComponent,
//     ConfirmationDialogComponent,
//     DialogModule,
//     InputTextModule,
//     ButtonModule,
//     DialogComponent,
//   ],
//   templateUrl: './employees.component.html',
//   styleUrl: './employees.component.scss',
// })
// export class EmployeesComponent implements OnInit {
//   @ViewChild(ConfirmationDialogComponent)
//   confirmDialog!: ConfirmationDialogComponent;

//   columns = [
//     { header: 'الاسم', field: 'name' },
//     { header: 'رقم الهاتف', field: 'phone' },
//     { header: 'الوظيفة', field: 'position' },
//     {
//       header: 'إجراءات',
//       field: 'actions',
//       type: 'actions',
//       actions: ['edit', 'delete'],
//     },
//   ];

//   data: any[] = [];
//   visible: boolean = false;
//   editingEmployeeId: number | null = null;
//   phoneError: string = '';

//   newEmployee = {
//     name: '',
//     phone: '',
//     position: '',
//   };

//   constructor(private dbService: DatabaseService) {}

//   async ngOnInit() {
//     await this.loadEmployees();
//   }

//   async loadEmployees() {
//     this.data = await this.dbService.getAllEmployees();
//   }

//   showDialog() {
//     this.resetForm();
//     this.visible = true;
//   }

//   onEdit(employee: any) {
//     this.newEmployee = {
//       name: employee.name || '',
//       phone: employee.phone || '',
//       position: employee.position || '',
//     };
//     this.editingEmployeeId = employee.id;
//     this.visible = true;
//   }

//   async onDelete(employee: any) {
//     this.confirmDialog.show({
//       message: `هل أنت متأكد من حذف الموظف "${employee.name}"؟`,
//       header: 'تأكيد الحذف',
//       acceptLabel: 'حذف',
//       rejectLabel: 'إلغاء',
//       accept: async () => {
//         try {
//           await this.dbService.deleteEmployee(employee.id);
//           await this.loadEmployees();
//         } catch (error) {
//           console.error('Error deleting employee:', error);
//         }
//       },
//     });
//   }

//   async saveEmployee() {
//     try {
//       if (!this.newEmployee.name) {
//         this.confirmDialog.show({
//           message: 'الرجاء إدخال اسم الموظف',
//           header: 'تنبيه',
//           acceptLabel: 'إلغاء',
//           showReject: false,
//         });
//         return;
//       }

//       if (!this.validateEgyptianPhone(this.newEmployee.phone)) {
//         this.phoneError = 'يجب إدخال رقم مصري مكون من 11 رقم يبدأ بـ 01';
//         return;
//       }
//       this.phoneError = '';

//       if (this.editingEmployeeId) {
//         await this.dbService.updateEmployee(
//           this.editingEmployeeId,
//           this.newEmployee
//         );
//       } else {
//         await this.dbService.addEmployee(this.newEmployee);
//       }

//       await this.loadEmployees();
//       this.closeDialog();
//     } catch (error) {
//       console.error('Error saving employee:', error);
//     }
//   }

//   validateEgyptianPhone(phone: string): boolean {
//     const phoneRegex = /^01[0-9]{9}$/;
//     return phoneRegex.test(phone);
//   }

//   closeDialog() {
//     this.visible = false;
//     this.phoneError = '';
//     this.resetForm();
//   }

//   onDialogHide() {
//     this.resetForm();
//   }

//   resetForm() {
//     this.newEmployee = {
//       name: '',
//       phone: '',
//       position: '',
//     };
//     this.editingEmployeeId = null;
//   }
// }
