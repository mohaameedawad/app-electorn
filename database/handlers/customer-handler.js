
const BaseHandler = require('./base-handler');

class CustomerHandler extends BaseHandler {
  // ============================
  // BASIC CUSTOMER METHODS
  // ============================
  
  getAllCustomers() {
    if (!this.data.customers) {
      this.data.customers = [];
    }
    return this.data.customers;
  }

  getCustomerById(id) {
    if (!this.data.customers) return null;
    return this.data.customers.find(c => c.id === id);
  }

  addCustomer(customer) {
    if (!this.data.customers) {
      this.data.customers = [];
    }
    
    const id = this._getNextId("customers");
    const newCustomer = {
      id,
      name: customer.name || '',
      phone: customer.phone || '',
      address: customer.address || '',
      email: customer.email || '',
      balance: 0, // الرصيد يبدأ من صفر
      credit_limit: customer.credit_limit || 0,
      notes: customer.notes || '',
      is_active: customer.is_active !== undefined ? customer.is_active : true,
      created_at: new Date().toISOString(),
      ...customer
    };

    this.data.customers.push(newCustomer);
    this.saveData();
    return { lastInsertRowid: id, changes: 1, row: newCustomer };
  }

  updateCustomer(id, customer) {
    if (!this.data.customers) {
      this.data.customers = [];
    }
    
    const idx = this.data.customers.findIndex(c => c.id === id);
    if (idx === -1) return { changes: 0 };

    this.data.customers[idx] = {
      ...this.data.customers[idx],
      ...customer,
      id: this.data.customers[idx].id // الحفاظ على الـ ID الأصلي
    };

    this.saveData();
    return { changes: 1, row: this.data.customers[idx] };
  }

  deleteCustomer(id) {
    if (!this.data.customers) {
      this.data.customers = [];
    }
    
    const idx = this.data.customers.findIndex(c => c.id === id);
    if (idx === -1) return { changes: 0 };

    this.data.customers.splice(idx, 1);
    this.saveData();
    return { changes: 1 };
  }

//   // ============================
//   // CUSTOMER BALANCE MANAGEMENT
//   // ============================
  
//   calculateCustomerBalance(customerId) {
//     const customer = this.getCustomerById(customerId);
//     if (!customer) return 0;

//     // حساب الرصيد من المبيعات والمدفوعات
//     const sales = this.data.sales?.filter(s => s.customer_id === customerId) || [];
//     const payments = this.data.payments_received?.filter(p => p.customer_id === customerId) || [];
//     const returns = this.data.sales_returns?.filter(r => r.customer_id === customerId) || [];

//     const totalSales = sales.reduce((sum, s) => sum + (s.total || 0), 0);
//     const totalPayments = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
//     const totalReturns = returns.reduce((sum, r) => sum + (r.total_refund || 0), 0);

//     // الرصيد = المبيعات - (المدفوعات + المرتجعات)
//     const balance = totalSales - (totalPayments + totalReturns);
//     return balance;
//   }

//   updateCustomerBalance(customerId) {
//     const customer = this.getCustomerById(customerId);
//     if (!customer) return;

//     customer.balance = this.calculateCustomerBalance(customerId);
//     this.saveData();
//     return customer.balance;
//   }

//   // تحديث رصيد العميل عند إضافة فاتورة بيع
//   addSaleToCustomerBalance(customerId, saleAmount) {
//     const customer = this.getCustomerById(customerId);
//     if (!customer) return { success: false, error: 'Customer not found' };

//     customer.balance = (customer.balance || 0) + saleAmount;
//     this.saveData();
    
//     return { 
//       success: true, 
//       newBalance: customer.balance,
//       customer: customer
//     };
//   }

//   // تحديث رصيد العميل عند إضافة دفعة
//   addPaymentToCustomerBalance(customerId, paymentAmount) {
//     const customer = this.getCustomerById(customerId);
//     if (!customer) return { success: false, error: 'Customer not found' };

//     customer.balance = (customer.balance || 0) - paymentAmount;
//     this.saveData();
    
//     return { 
//       success: true, 
//       newBalance: customer.balance,
//       customer: customer
//     };
//   }

//   // التحقق من الحد الائتماني
//   checkCreditLimit(customerId, newSaleAmount) {
//     const customer = this.getCustomerById(customerId);
//     if (!customer) return { valid: false, error: 'Customer not found' };

//     const currentBalance = customer.balance || 0;
//     const creditLimit = customer.credit_limit || 0;
//     const projectedBalance = currentBalance + newSaleAmount;

//     if (creditLimit > 0 && projectedBalance > creditLimit) {
//       return {
//         valid: false,
//         currentBalance: currentBalance,
//         creditLimit: creditLimit,
//         projectedBalance: projectedBalance,
//         error: `تجاوز الحد الائتماني. الرصيد الحالي: ${currentBalance}, الحد: ${creditLimit}`
//       };
//     }

//     return {
//       valid: true,
//       currentBalance: currentBalance,
//       creditLimit: creditLimit,
//       projectedBalance: projectedBalance
//     };
//   }

//   // ============================
//   // SEARCH AND FILTER
//   // ============================
  
//   searchCustomers(searchTerm) {
//     if (!this.data.customers) return [];
    
//     const term = searchTerm.toLowerCase();
//     return this.data.customers.filter(customer => 
//       customer.name?.toLowerCase().includes(term) ||
//       customer.phone?.includes(term) ||
//       customer.email?.toLowerCase().includes(term)
//     );
//   }

//   getCustomersWithBalance() {
//     if (!this.data.customers) return [];
//     return this.data.customers.map(customer => ({
//       ...customer,
//       balance: this.calculateCustomerBalance(customer.id)
//     }));
//   }

//   getCustomersWithDebt() {
//     if (!this.data.customers) return [];
//     return this.data.customers.filter(customer => 
//       this.calculateCustomerBalance(customer.id) > 0
//     );
//   }
}

module.exports = CustomerHandler;
