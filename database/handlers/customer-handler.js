const BaseHandler = require('./base-handler');

class CustomerHandler extends BaseHandler {
  getCustomers() {
    return this.data.customers || [];
  }

  getCustomerById(id) {
    return this.getCustomers().find(c => c.id === id);
  }

   addCustomer(customer) {
    if (!this.data.customers) {
      this.data.customers = [];
    }

    // 🔹 حساب balance من credit و debit
    const balance = (customer.debit || 0) - (customer.credit || 0);

    const newCustomer = {
      id: this._getNextId("customers"),
      ...customer,
      balance: balance, // 🔹 إضافة حقل balance
      createdAt: new Date().toISOString(),
    };

    this.data.customers.push(newCustomer);
    this.saveData();
    return newCustomer;
  }

  updateCustomer(id, customer) {
    const index = this.getCustomers().findIndex((c) => c.id === id);
    if (index !== -1) {
      const balance = (customer.debit || 0) - (customer.credit || 0);

      this.data.customers[index] = {
        ...this.data.customers[index],
        ...customer,
        balance: balance, // 🔹 تحديث balance
        updatedAt: new Date().toISOString(),
      };

      this.saveData();
      return this.data.customers[index];
    }
    return null;
  }

   deleteCustomer(id) {
    const initialLength = this.getCustomers().length;
    this.data.customers = this.getCustomers().filter((c) => c.id !== id);
    this.saveData();
    return { changes: initialLength - this.getCustomers().length };
  }

  // 🔹 دالة لتحديث رصيد العميل (ممكن تضيفها لو محتاج)
  updateCustomerBalance(customerId, amount) {
    const customer = this.getCustomerById(customerId);
    if (customer) {
      customer.balance = (customer.balance || 0) + amount;
      this.saveData();
    }
  }

  // 🔹 دالة للحصول على عملاء مدينين
  getDebtors() {
    return this.getCustomers().filter(customer => (customer.balance || 0) > 0);
  }

  // 🔹 دالة للحصول على إحصائيات المديونية
  getDebtStatistics() {
    const customers = this.getCustomers();
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