const fs = require('fs');
const path = require('path');
const { app } = require('electron');

class DatabaseHandler {
  constructor() {
    const userDataPath = app.getPath('userData');
    this.dbPath = path.join(userDataPath, 'app-database.json');
    this.data = this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(this.dbPath)) {
        const fileData = fs.readFileSync(this.dbPath, 'utf8');
        return JSON.parse(fileData);
      }
    } catch (error) {
      console.error('Error loading database:', error);
    }
    
    return {
      customers: [],
      suppliers: [],
      products: [],
      sales: [],
      employees: [],
      purchases: [],
      payments: [],
      expenses: []
    };
  }

  saveData() {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  getAllCustomers() {
    return this.data.customers;
  }

  addCustomer(customer) {
    const newId = this.data.customers.length > 0 ? Math.max(...this.data.customers.map(c => c.id)) + 1 : 1;
    const newCustomer = { id: newId, ...customer };
    this.data.customers.push(newCustomer);
    this.saveData();
    return { lastInsertRowid: newId, changes: 1 };
  }

  updateCustomer(id, customer) {
    const index = this.data.customers.findIndex(c => c.id === id);
    if (index !== -1) {
      this.data.customers[index] = { ...this.data.customers[index], ...customer };
      this.saveData();
      return { changes: 1 };
    }
    return { changes: 0 };
  }

  deleteCustomer(id) {
    const initialLength = this.data.customers.length;
    this.data.customers = this.data.customers.filter(c => c.id !== id);
    this.saveData();
    return { changes: initialLength - this.data.customers.length };
  }

  getAllSuppliers() {
    return this.data.suppliers;
  }

  addSupplier(supplier) {
    const newId = this.data.suppliers.length > 0 ? Math.max(...this.data.suppliers.map(s => s.id)) + 1 : 1;
    const newSupplier = { id: newId, ...supplier };
    this.data.suppliers.push(newSupplier);
    this.saveData();
    return { lastInsertRowid: newId, changes: 1 };
  }

  updateSupplier(id, supplier) {
    const index = this.data.suppliers.findIndex(s => s.id === id);
    if (index !== -1) {
      this.data.suppliers[index] = { ...this.data.suppliers[index], ...supplier };
      this.saveData();
      return { changes: 1 };
    }
    return { changes: 0 };
  }

  deleteSupplier(id) {
    const initialLength = this.data.suppliers.length;
    this.data.suppliers = this.data.suppliers.filter(s => s.id !== id);
    this.saveData();
    return { changes: initialLength - this.data.suppliers.length };
  }

  getAllProducts() {
    return this.data.products;
  }

  addProduct(product) {
    const newId = this.data.products.length > 0 ? Math.max(...this.data.products.map(p => p.id)) + 1 : 1;
    const newProduct = { id: newId, ...product };
    this.data.products.push(newProduct);
    this.saveData();
    return { lastInsertRowid: newId, changes: 1 };
  }

  updateProduct(id, product) {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.data.products[index] = { ...this.data.products[index], ...product };
      this.saveData();
      return { changes: 1 };
    }
    return { changes: 0 };
  }

  deleteProduct(id) {
    const initialLength = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    this.saveData();
    return { changes: initialLength - this.data.products.length };
  }

  getAllSales() {
    return this.data.sales;
  }

  addSale(sale) {
    const newId = this.data.sales.length > 0 ? Math.max(...this.data.sales.map(s => s.id)) + 1 : 1;
    const newSale = { id: newId, ...sale };
    this.data.sales.push(newSale);
    this.saveData();
    return { lastInsertRowid: newId, changes: 1 };
  }

  updateSale(id, sale) {
    const index = this.data.sales.findIndex(s => s.id === id);
    if (index !== -1) {
      this.data.sales[index] = { ...this.data.sales[index], ...sale };
      this.saveData();
      return { changes: 1 };
    }
    return { changes: 0 };
  }

  deleteSale(id) {
    const initialLength = this.data.sales.length;
    this.data.sales = this.data.sales.filter(s => s.id !== id);
    this.saveData();
    return { changes: initialLength - this.data.sales.length };
  }

  // Employees methods
  getEmployees() {
    if (!this.data.employees) {
      this.data.employees = [];
    }
    return this.data.employees;
  }

  addEmployee(employee) {
    // Initialize employees array if it doesn't exist
    if (!this.data.employees) {
      this.data.employees = [];
    }
    
    const newEmployee = {
      id: this.data.employees.length > 0 ? Math.max(...this.data.employees.map(e => e.id)) + 1 : 1,
      ...employee
    };
    this.data.employees.push(newEmployee);
    this.saveData();
    return newEmployee;
  }

  updateEmployee(id, employee) {
    const index = this.data.employees.findIndex(e => e.id === id);
    if (index !== -1) {
      this.data.employees[index] = { ...this.data.employees[index], ...employee };
      this.saveData();
      return this.data.employees[index];
    }
    return null;
  }

  deleteEmployee(id) {
    this.data.employees = this.data.employees.filter(e => e.id !== id);
    this.saveData();
  }

  // Purchases methods
  getPurchases() {
    if (!this.data.purchases) {
      this.data.purchases = [];
    }
    return this.data.purchases;
  }

  addPurchase(purchase) {
    // Initialize purchases array if it doesn't exist
    if (!this.data.purchases) {
      this.data.purchases = [];
    }
    
    const newPurchase = {
      id: this.data.purchases.length > 0 ? Math.max(...this.data.purchases.map(p => p.id)) + 1 : 1,
      ...purchase
    };
    this.data.purchases.push(newPurchase);
    this.saveData();
    return newPurchase;
  }

  updatePurchase(id, purchase) {
    const index = this.data.purchases.findIndex(p => p.id === id);
    if (index !== -1) {
      this.data.purchases[index] = { ...this.data.purchases[index], ...purchase };
      this.saveData();
      return this.data.purchases[index];
    }
    return null;
  }

  deletePurchase(id) {
    this.data.purchases = this.data.purchases.filter(p => p.id !== id);
    this.saveData();
  }

  // Payments methods
  getPayments() {
    if (!this.data.payments) {
      this.data.payments = [];
    }
    return this.data.payments;
  }

  addPayment(payment) {
    if (!this.data.payments) {
      this.data.payments = [];
    }
    
    const newPayment = {
      id: this.data.payments.length > 0 ? Math.max(...this.data.payments.map(p => p.id)) + 1 : 1,
      ...payment
    };
    this.data.payments.push(newPayment);
    this.saveData();
    return newPayment;
  }

  updatePayment(id, payment) {
    const index = this.data.payments.findIndex(p => p.id === id);
    if (index !== -1) {
      this.data.payments[index] = { ...this.data.payments[index], ...payment };
      this.saveData();
      return this.data.payments[index];
    }
    return null;
  }

  deletePayment(id) {
    this.data.payments = this.data.payments.filter(p => p.id !== id);
    this.saveData();
  }

  // Expenses methods
  getExpenses() {
    if (!this.data.expenses) {
      this.data.expenses = [];
    }
    return this.data.expenses;
  }

  addExpense(expense) {
    if (!this.data.expenses) {
      this.data.expenses = [];
    }
    
    const newExpense = {
      id: this.data.expenses.length > 0 ? Math.max(...this.data.expenses.map(e => e.id)) + 1 : 1,
      ...expense
    };
    this.data.expenses.push(newExpense);
    this.saveData();
    return newExpense;
  }

  updateExpense(id, expense) {
    const index = this.data.expenses.findIndex(e => e.id === id);
    if (index !== -1) {
      this.data.expenses[index] = { ...this.data.expenses[index], ...expense };
      this.saveData();
      return this.data.expenses[index];
    }
    return null;
  }

  deleteExpense(id) {
    this.data.expenses = this.data.expenses.filter(e => e.id !== id);
    this.saveData();
  }

  close() {
    this.saveData();
  }
}

module.exports = DatabaseHandler;
