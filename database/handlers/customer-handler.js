const BaseHandler = require('./base-handler');

class CustomerHandler extends BaseHandler {
  getAllCustomers() {
    return this.data.customers || [];
  }

  getCustomerById(id) {
    return this.getAllCustomers().find(c => c.id === id);
  }

  addCustomer(customer) {
    if (!this.data.customers) this.data.customers = [];
    
    const newCustomer = {
      id: this._getNextId('customers'),
      ...customer,
      createdAt: new Date().toISOString(),
      balance: customer.balance || 0,
      credit_limit: customer.credit_limit || 0,
      total_purchases: customer.total_purchases || 0
    };
    
    this.data.customers.push(newCustomer);
    this.saveData();
    return { lastInsertRowid: newCustomer.id, changes: 1 };
  }

  updateCustomer(id, customer) {
    const index = this.getAllCustomers().findIndex(c => c.id === id);
    if (index !== -1) {
      this.data.customers[index] = { 
        ...this.data.customers[index], 
        ...customer,
        updatedAt: new Date().toISOString()
      };
      this.saveData();
      return { changes: 1 };
    }
    return { changes: 0 };
  }

  deleteCustomer(id) {
    const initialLength = this.getAllCustomers().length;
    this.data.customers = this.getAllCustomers().filter(c => c.id !== id);
    this.saveData();
    return { changes: initialLength - this.getAllCustomers().length };
  }

  // 🔹 دالة لتحديث رصيد العميل
  updateCustomerBalance(id, amount) {
    const customer = this.getCustomerById(id);
    if (customer) {
      customer.balance = (customer.balance || 0) + amount;
      customer.updatedAt = new Date().toISOString();
      this.saveData();
      return true;
    }
    return false;
  }

  // 🔹 دالة للحصول على عملاء مدينين
  getDebtors() {
    return this.getAllCustomers().filter(customer => (customer.balance || 0) > 0);
  }

  // 🔹 دالة للحصول على إحصائيات المديونية
  getDebtStatistics() {
    const customers = this.getAllCustomers();
    const totalDebt = customers.reduce((sum, customer) => sum + (customer.balance || 0), 0);
    const debtorsCount = customers.filter(c => (c.balance || 0) > 0).length;
    
    return {
      totalDebt,
      debtorsCount,
      totalCustomers: customers.length,
      averageDebt: debtorsCount > 0 ? totalDebt / debtorsCount : 0
    };
  }

  // 🔹 دالة للحصول على تاريخ المعاملات للعميل
  getCustomerTransactions(customerId) {
    if (!this.data.sales) return [];
    
    return this.data.sales
      .filter(sale => sale.customer_id === customerId)
      .map(sale => ({
        type: 'sale',
        id: sale.id,
        date: sale.sale_date || sale.createdAt,
        amount: sale.total,
        paid: sale.paid_amount || 0,
        remaining: sale.remaining_amount || (sale.total - (sale.paid_amount || 0)),
        description: `فاتورة مبيعات #${sale.invoice_no}`
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // 🔹 دالة للتحقق من الحد الائتماني
  checkCreditLimit(customerId, amount) {
    const customer = this.getCustomerById(customerId);
    if (!customer) return { allowed: false, reason: 'العميل غير موجود' };
    
    const currentBalance = customer.balance || 0;
    const creditLimit = customer.credit_limit || 0;
    const newBalance = currentBalance + amount;
    
    if (creditLimit > 0 && newBalance > creditLimit) {
      return { 
        allowed: false, 
        reason: `تجاوز الحد الائتماني. الرصيد الحالي: ${currentBalance}, الحد: ${creditLimit}` 
      };
    }
    
    return { allowed: true, currentBalance: newBalance };
  }
}

module.exports = CustomerHandler;