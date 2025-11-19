const BaseHandler = require('./base-handler');
const CustomerHandler = require('./customer-handler');
const SupplierHandler = require('./supplier-handler');
const ProductHandler = require('./product-handler');
const SaleHandler = require('./sale-handler');
const EmployeeHandler = require('./employee-handler');
const PurchaseHandler = require('./purchase-handler');
const PaymentHandler = require('./payment-handler');
const ExpenseHandler = require('./expense-handler');
const UsersHandler = require('./users-handler');

class DatabaseService {
  constructor() {
    // Create a shared data instance
    const baseHandler = new BaseHandler();
    const sharedData = baseHandler.data;

    // Initialize all handlers with shared data
    this.customers = new CustomerHandler(sharedData);
    this.suppliers = new SupplierHandler(sharedData);
    this.products = new ProductHandler(sharedData);
    this.sales = new SaleHandler(sharedData);
    this.employees = new EmployeeHandler(sharedData);
    this.purchases = new PurchaseHandler(sharedData);
    this.payments = new PaymentHandler(sharedData);
    this.expenses = new ExpenseHandler(sharedData);
    this.users = new UsersHandler(sharedData);

    // Store shared data reference
    this.sharedData = sharedData;
  }

  // Global methods
  getDashboardStats() {
    return {
      totalCustomers: this.customers.getAllCustomers().length,
      totalSuppliers: this.suppliers.getAllSuppliers().length,
      totalProducts: this.products.getAllProducts().length,
      totalSales: this.sales.getAllSales().length,
      totalEmployees: this.employees.getEmployees().length,
      totalPurchases: this.purchases.getPurchases().length,
      totalExpenses: this.expenses.getExpenses().length,
    };
  }

  // Backup method
  backupData() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(app.getPath('userData'), `backup-${timestamp}.json`);
      fs.writeFileSync(backupPath, JSON.stringify(this.sharedData, null, 2));
      return backupPath;
    } catch (error) {
      console.error('Backup failed:', error);
      return null;
    }
  }

  close() {
    // Save all data
    this.customers.saveData();
  }
}

module.exports = DatabaseService;