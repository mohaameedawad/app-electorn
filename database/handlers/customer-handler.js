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
      balance: customer.balance || 0
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

  updateCustomerBalance(id, amount) {
    const customer = this.getCustomerById(id);
    if (customer) {
      customer.balance = (customer.balance || 0) + amount;
      this.saveData();
      return true;
    }
    return false;
  }
}

module.exports = CustomerHandler;