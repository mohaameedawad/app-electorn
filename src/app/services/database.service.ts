import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private get api() {
    const electronAPI = (window as any).electronAPI;
    if (!electronAPI) {
      console.error('Electron API not available!');
      return null;
    }
    return electronAPI;
  }

  // العملاء
  async getCustomers() {
    if (!this.api) return [];
    try {
      return await this.api.getCustomers();
    } catch (error) {
      console.error('Error getting customers:', error);
      return [];
    }
  }

  async addCustomer(customer: any) {
    if (!this.api) return null;
    return await this.api.addCustomer(customer);
  }

  async updateCustomer(id: number, customer: any) {
    if (!this.api) return null;
    return await this.api.updateCustomer(id, customer);
  }

  async deleteCustomer(id: number) {
    if (!this.api) return null;
    return await this.api.deleteCustomer(id);
  }

  // الموردين
  async getSuppliers() {
    if (!this.api) return [];
    try {
      return await this.api.getSuppliers();
    } catch (error) {
      console.error('Error getting suppliers:', error);
      return [];
    }
  }

  async addSupplier(supplier: any) {
    if (!this.api) return null;
    return await this.api.addSupplier(supplier);
  }

  async updateSupplier(id: number, supplier: any) {
    if (!this.api) return null;
    return await this.api.updateSupplier(id, supplier);
  }

  async deleteSupplier(id: number) {
    if (!this.api) return null;
    return await this.api.deleteSupplier(id);
  }

  // المنتجات
  async getProducts() {
    if (!this.api) return [];
    try {
      return await this.api.getProducts();
    } catch (error) {
      console.error('Error getting products:', error);
      return [];
    }
  }

  async addProduct(product: any) {
    if (!this.api) return null;
    return await this.api.addProduct(product);
  }

  async updateProduct(id: number, product: any) {
    if (!this.api) return null;
    return await this.api.updateProduct(id, product);
  }

  async deleteProduct(id: number) {
    if (!this.api) return null;
    return await this.api.deleteProduct(id);
  }

  // المبيعات
  async getSales() {
    if (!this.api) return [];
    try {
      return await this.api.getSales();
    } catch (error) {
      console.error('Error getting sales:', error);
      return [];
    }
  }

  async addSale(sale: any) {
    if (!this.api) return null;
    try {
      const result = await this.api.addSale(sale);
      return result;
    } catch (error) {
      console.error('❌ خطأ في إضافة الفاتورة من service:', error);
      return null;
    }
  }

  async updateSale(id: number, sale: any) {
    if (!this.api) return null;
    try {
      const result = await this.api.updateSale(id, sale);
      return result;
    } catch (error) {
      console.error('Error getting employees:', error);
      return [];
    }
  }

  async deleteSale(id: number) {
    if (!this.api) return null;
    return await this.api.deleteSale(id);
  }

  async getSaleById(id: number) {
    if (!this.api) return null;
    try {
      return await this.api.getSaleById(id);
    } catch (error) {
      console.error('Error getting sale by ID:', error);
      return null;
    }
  }

  // الموظفين
  async getEmployees() {
    if (!this.api) return [];
    try {
      return await this.api.getEmployees();
    } catch (error) {
      console.error('Error getting employees:', error);
      return [];
    }
  }

  async addEmployee(employee: any) {
    if (!this.api) return null;
    return await this.api.addEmployee(employee);
  }

  async updateEmployee(id: number, employee: any) {
    if (!this.api) return null;
    return await this.api.updateEmployee(id, employee);
  }

  async deleteEmployee(id: number) {
    if (!this.api) return null;
    return await this.api.deleteEmployee(id);
  }

  // المشتريات
  async getPurchases() {
    if (!this.api) return [];
    try {
      return await this.api.getPurchases();
    } catch (error) {
      console.error('Error getting purchases:', error);
      return [];
    }
  }

  async addPurchase(purchase: any) {
    if (!this.api) return null;
    return await this.api.addPurchase(purchase);
  }

  async updatePurchase(id: number, purchase: any) {
    if (!this.api) return null;
    return await this.api.updatePurchase(id, purchase);
  }

  async deletePurchase(id: number) {
    if (!this.api) return null;
    return await this.api.deletePurchase(id);
  }

  // الدفعات
  async getPayments() {
    if (!this.api) return [];
    try {
      const result = await this.api.getPayments();
      // 🔹 دمج received و made في array واحدة
      const allPayments = [...(result.received || []), ...(result.made || [])];
      return allPayments;
    } catch (error) {
      console.error('Error getting payments:', error);
      return [];
    }
  }

  async addPayment(payment: any) {
    if (!this.api) return null;
    try {
      // 🔹 استخدم addPayment العادية فقط
      return await this.api.addPayment(payment);
    } catch (error) {
      console.error('Error adding payment:', error);
      return null;
    }
  }

  async updatePayment(id: number, payment: any) {
    if (!this.api) return null;
    return await this.api.updatePayment(id, payment);
  }

  async deletePayment(id: number) {
    if (!this.api) return null;
    return await this.api.deletePayment(id);
  }

  // المصروفات
  async getExpenses() {
    if (!this.api) return [];
    try {
      return await this.api.getExpenses();
    } catch (error) {
      console.error('Error getting expenses:', error);
      return [];
    }
  }

  async addExpense(expense: any) {
    if (!this.api) return null;
    return await this.api.addExpense(expense);
  }

  async updateExpense(id: number, expense: any) {
    if (!this.api) return null;
    return await this.api.updateExpense(id, expense);
  }

  async deleteExpense(id: number) {
    if (!this.api) return null;
    return await this.api.deleteExpense(id);
  }

  async getExpenseStats() {
    if (!this.api) return null;
    return await this.api.getExpenseStats();
  }

  async getExpensesByDateRange(startDate: string, endDate: string) {
    if (!this.api) return [];
    return await this.api.getExpensesByDateRange(startDate, endDate);
  }

  // المستخدمين
  async getUsers() {
    if (!this.api) return [];
    try {
      return await this.api.getUsers();
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  async addUser(user: any) {
    if (!this.api) return null;
    return await this.api.addUser(user);
  }

  async updateUser(id: number, user: any) {
    if (!this.api) return null;
    return await this.api.updateUser(id, user);
  }

  async deleteUser(id: number) {
    if (!this.api) return null;
    return await this.api.deleteUser(id);
  }

  async checkProductStock(
    productId: number,
    requestedQuantity: number
  ): Promise<any> {
    try {
      const products = await this.getProducts();
      const product = products.find((p: any) => p.id === productId);

      if (!product) {
        return {
          available: false,
          productName: 'منتج غير معروف',
          availableStock: 0,
          requestedQuantity,
        };
      }

      const availableStock = parseFloat(product.stock) || 0;

      return {
        available: availableStock >= requestedQuantity,
        productName: product.name,
        availableStock,
        requestedQuantity,
      };
    } catch (error) {
      console.error('Error in checkProductStock:', error);
      throw error;
    }
  }
}
