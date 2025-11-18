import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  reportsChanged$ = new BehaviorSubject<void>(undefined);

  private get api() {
    return (window as any).electronAPI || null;
  }

  // ============================================
  // CUSTOMERS
  // ============================================
  async getAllCustomers() {
    return this.api?.getAllCustomers() || [];
  }
  async addCustomer(c: any) {
    const r = await this.api?.addCustomer(c);
    this.reportsChanged$.next();
    return r;
  }
  async updateCustomer(id: number, c: any) {
    const r = await this.api?.updateCustomer(id, c);
    this.reportsChanged$.next();
    return r;
  }
  async deleteCustomer(id: number) {
    const r = await this.api?.deleteCustomer(id);
    this.reportsChanged$.next();
    return r;
  }

  // ============================================
  // SUPPLIERS
  // ============================================
  async getAllSuppliers() {
    return this.api?.getAllSuppliers() || [];
  }
  async addSupplier(s: any) {
    const r = await this.api?.addSupplier(s);
    this.reportsChanged$.next();
    return r;
  }
  async updateSupplier(id: number, s: any) {
    const r = await this.api?.updateSupplier(id, s);
    this.reportsChanged$.next();
    return r;
  }
  async deleteSupplier(id: number) {
    const r = await this.api?.deleteSupplier(id);
    this.reportsChanged$.next();
    return r;
  }

//   // ============================================
//   // PRODUCTS
//   // ============================================
// async getAllProducts() {
//   return this.api?.getAllProducts() || [];
// }

// async addProduct(p: any) {
//   const r = await this.api?.addProduct(p);
//   this.reportsChanged$.next();
//   return r;
// }

// async updateProduct(id: number, p: any) {
//   const r = await this.api?.updateProduct(id, p);
//   this.reportsChanged$.next();
//   return r;
// }

// async deleteProduct(id: number) {
//   const r = await this.api?.deleteProduct(id);
//   this.reportsChanged$.next();
//   return r;
// }

// async getProductById(id: number) {
//   return this.api?.getProductById(id);
// }

// async calculateStock(productId: number) {
//   return this.api?.calculateProductStock(productId);
// }

// async validateStockForSale(items: any[]) {
//   return this.api?.validateStockForSale(items);
// }

// async adjustStock(productId: number, newStock: number, reason: string) {
//   return this.api?.adjustStock(productId, newStock, reason);
// }

// // ============================================
// // CATEGORIES
// // ============================================
// async getAllCategories() {
//   return this.api?.getAllCategories() || [];
// }

// async addCategory(category: any) {
//   const r = await this.api?.addCategory(category);
//   this.reportsChanged$.next();
//   return r;
// }

// async updateCategory(id: number, category: any) {
//   const r = await this.api?.updateCategory(id, category);
//   this.reportsChanged$.next();
//   return r;
// }

// async deleteCategory(id: number) {
//   const r = await this.api?.deleteCategory(id);
//   this.reportsChanged$.next();
//   return r;
// }

//   // ============================================
//   // SALES (فاتورة بيع)
//   // ============================================
//   async getAllSales() {
//     return this.api?.getAllSales() || [];
//   }
//   async addSale(sale: any) {
//     const r = await this.api?.addSale(sale);
//     this.reportsChanged$.next();
//     return r;
//   }
//   async updateSale(id: number, sale: any) {
//     const r = await this.api?.updateSale(id, sale);
//     this.reportsChanged$.next();
//     return r;
//   }
//   async deleteSale(id: number) {
//     const r = await this.api?.deleteSale(id);
//     this.reportsChanged$.next();
//     return r;
//   }
//   async getSaleItems() {
//     return this.api?.getSaleItems?.() || [];
//   }

  
//   // ============================================
//   // PURCHASES (فاتورة شراء)
//   // ============================================

// async deletePurchase(id: number) {
//   const r = await this.api?.deletePurchase(id);
//   this.reportsChanged$.next();
//   return r;
// }

// // ============================================
// // PURCHASE ITEMS - عناصر المشتريات (محدث)
// // ============================================


// async getAllPurchases() {
//   return this.api?.getAllPurchases?.() || [];
// }

// async addPurchase(purchase: any) {
//   const r = await this.api?.addPurchase?.(purchase);
//   this.reportsChanged$.next();
//   return r;
// }

// async updatePurchase(id: number, purchase: any) {
//   const r = await this.api?.updatePurchase?.(id, purchase);
//   this.reportsChanged$.next();
//   return r;
// }



// async getPurchaseItems() {
//   return this.api?.getPurchaseItems?.() || [];
// }

// async getPurchaseItemsByPurchaseId(purchaseId: number) {
//   return this.api?.getPurchaseItemsByPurchaseId?.(purchaseId) || [];
// }

// async addPurchaseItem(item: any) {
//   const r = await this.api?.addPurchaseItem?.(item);
//   this.reportsChanged$.next();
//   return r;
// }

// async updatePurchaseItem(id: number, item: any) {
//   const r = await this.api?.updatePurchaseItem?.(id, item);
//   this.reportsChanged$.next();
//   return r;
// }

// async deletePurchaseItems(purchaseId: number) {
//   const r = await this.api?.deletePurchaseItems?.(purchaseId);
//   this.reportsChanged$.next();
//   return r;
// }

// async clearPurchaseItems(purchaseId: number) {
//   const r = await this.api?.clearPurchaseItems?.(purchaseId);
//   this.reportsChanged$.next();
//   return r;
// }

// // ============================================
// // SUPPLIER BALANCES - أرصدة الموردين (جديد)
// // ============================================
// async calculateSupplierBalance(supplierId: number): Promise<number> {
//   return this.api?.calculateSupplierBalance?.(supplierId) || 0;
// }

// async getSupplierWithBalance(supplierId: number): Promise<any> {
//   return this.api?.getSupplierWithBalance?.(supplierId) || null;
// }

// async getAllSuppliersWithBalances(): Promise<any[]> {
//   return this.api?.getAllSuppliersWithBalances?.() || [];
// }

//   // ============================================
//   // PAYMENTS RECEIVED (قبض من عميل)
//   // ============================================
//   async getPaymentsReceived() {
//     return this.api?.getPaymentsReceived?.() || [];
//   }

//   async addPaymentReceived(p: any) {
//     const r = await this.api?.addPaymentReceived?.(p);
//     this.reportsChanged$.next();
//     return r;
//   }

//   async updatePaymentReceived(id: number, p: any) {
//     const r = await this.api?.updatePaymentReceived?.(id, p);
//     this.reportsChanged$.next();
//     return r;
//   }

//   async deletePaymentReceived(id: number) {
//     const r = await this.api?.deletePaymentReceived?.(id);
//     this.reportsChanged$.next();
//     return r;
//   }

//   // ============================================
//   // SUPPLIER PAYMENTS (سند صرف)
//   // ============================================
//   async getSupplierPayments() {
//     return this.api?.getSupplierPayments?.() || [];
//   }

//   async addSupplierPayment(p: any) {
//     const r = await this.api?.addSupplierPayment?.(p);
//     this.reportsChanged$.next();
//     return r;
//   }

//   async updateSupplierPayment(id: number, p: any) {
//     const r = await this.api?.updateSupplierPayment?.(id, p);
//     this.reportsChanged$.next();
//     return r;
//   }

//   async deleteSupplierPayment(id: number) {
//     const r = await this.api?.deleteSupplierPayment?.(id);
//     this.reportsChanged$.next();
//     return r;
//   }

//   // ============================================
//   // EXPENSES
//   // ============================================
//   async getExpenses() {
//     return this.api?.getExpenses() || [];
//   }
//   async addExpense(e: any) {
//     const r = await this.api?.addExpense(e);
//     this.reportsChanged$.next();
//     return r;
//   }
//   async updateExpense(id: number, e: any) {
//     const r = await this.api?.updateExpense(id, e);
//     this.reportsChanged$.next();
//     return r;
//   }
//   async deleteExpense(id: number) {
//     const r = await this.api?.deleteExpense(id);
//     this.reportsChanged$.next();
//     return r;
//   }

//   // ============================================
//   // SALES RETURNS (مرتجعات بيع)
//   // ============================================
//   async addSalesReturn(data: any) {
//     const r = await this.api?.addSalesReturn?.(data);
//     this.reportsChanged$.next();
//     return r;
//   }

//   async getAllSalesReturns() {
//     return this.api?.getAllSalesReturns?.() || [];
//   }

//   // ============================================
//   // STOCK MOVEMENTS
//   // ============================================
//   async getStockMovements() {
//     return this.api?.getStockMovements?.() || [];
//   }

//   // ============================================
//   // EMPLOYEES
//   // ============================================
//   async getAllEmployees() {
//     return this.api?.getAllEmployees() || [];
//   }

//   async addEmployee(employee: any) {
//     return this.api?.addEmployee(employee);
//   }

//   async updateEmployee(id: number, employee: any) {
//     return this.api?.updateEmployee(id, employee);
//   }

//   async deleteEmployee(id: number) {
//     return this.api?.deleteEmployee(id);
//   }

//   // ============================================
//   // USERS
//   // ============================================
  async getAllUsers() {
    return this.api?.getAllUsers() || [];
  }
  async addUser(u: any) {
    const r = await this.api?.addUser(u);
    this.reportsChanged$.next();
    return r;
  }
  async updateUser(id: number, u: any) {
    const r = await this.api?.updateUser(id, u);
    this.reportsChanged$.next();
    return r;
  }
  async deleteUser(id: number) {
    const r = await this.api?.deleteUser(id);
    this.reportsChanged$.next();
    return r;
  }


//   async addStockMovement(movement: any) {
//     const r = await this.api?.addStockMovement?.(movement);
//     this.reportsChanged$.next();
//     return r;
//   }

//   // في DatabaseService
//   calculateCustomerBalance(customerId: number): Promise<number> {
//     return this.api.calculateCustomerBalance(customerId);
//   }

//   getCustomerWithBalance(customerId: number): Promise<any> {
//     return this.api.getCustomerWithBalance(customerId);
//   }

//   getAllCustomersWithBalances(): Promise<any[]> {
//     return this.api.getAllCustomersWithBalances();
//   }
}