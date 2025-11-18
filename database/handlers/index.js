const BaseHandler = require("./base-handler");
const CustomerHandler = require("./customer-handler");
const EmployeeHandler = require("./employee-handler");
const UsersHandler = require("./users-handler");
const ProductHandler = require("./product-handler");
const SupplierHandler = require("./supplier-handler");
const SaleHandler = require("./sale-handler");
const PurchaseHandler = require('./purchases-handler');
const PaymentHandler = require('./payment-handler');
const ExpenseHandler = require('./expense-handler');

class DatabaseHandler extends BaseHandler {
  constructor() {
    super();
    const sharedData = this.data;
    this.customers = new CustomerHandler(sharedData);
    this.employees = new EmployeeHandler(sharedData);
    this.users = new UsersHandler(sharedData);
    this.products = new ProductHandler(sharedData);
    this.suppliers = new SupplierHandler(sharedData);
    this.sales = new SaleHandler(sharedData);
    this.purchases = new PurchaseHandler(sharedData);
  }

  // دوال العملاء
  getAllCustomers() {
    return this.customers.getAllCustomers();
  }

  addCustomer(customer) {
    return this.customers.addCustomer(customer);
  }

  updateCustomer(id, customer) {
    return this.customers.updateCustomer(id, customer);
  }

  deleteCustomer(id) {
    return this.customers.deleteCustomer(id);
  }

  // دوال الموظفين
//   getAllEmployees() {
//     return this.employees.getAllEmployees();
//   }

//   addEmployee(employee) {
//     return this.employees.addEmployee(employee);
//   }

//   updateEmployee(id, employee) {
//     return this.employees.updateEmployee(id, employee);
//   }

//   deleteEmployee(id) {
//     return this.employees.deleteEmployee(id);
//   }

  getAllUsers() {
    return this.users.getAllUsers();
  }

  addUser(user) {
    return this.users.addUser(user);
  }

  updateUser(id, user) {
    return this.users.updateUser(id, user);
  }

  deleteUser(id) {
    return this.users.deleteUser(id);
  }

//   // الدوال الإضافية
  getUserById(id) {
    return this.users.getUserById(id);
  }

  authenticateUser(username, password) {
    return this.users.authenticateUser(username, password);
  }

//   getAllProducts() {
//     return this.products.getAllProducts();
//   }

//   getProductById(id) {
//     return this.products.getProductById(id);
//   }

//   addProduct(product) {
//     return this.products.addProduct(product);
//   }

//   updateProduct(id, product) {
//     return this.products.updateProduct(id, product);
//   }

//   deleteProduct(id) {
//     return this.products.deleteProduct(id);
//   }

//   calculateProductStock(productId) {
//     return this.products.calculateProductStock(productId);
//   }

//   validateStockForSale(items) {
//     return this.products.validateStockForSale(items);
//   }

//   processSaleStock(saleId, items) {
//     return this.products.processSaleStock(saleId, items);
//   }

//   processPurchaseStock(purchaseId, items) {
//     return this.products.processPurchaseStock(purchaseId, items);
//   }

//   adjustStock(productId, newStock, reason) {
//     return this.products.adjustStock(productId, newStock, reason);
//   }

//   // دوال الفئات
//   getAllCategories() {
//     return this.products.getAllCategories();
//   }

//   addCategory(category) {
//     return this.products.addCategory(category);
//   }

//   updateCategory(id, category) {
//     return this.products.updateCategory(id, category);
//   }

//   deleteCategory(id) {
//     return this.products.deleteCategory(id);
//   }

  getAllSuppliers() {
    return this.suppliers.getAllSuppliers();
  }

  getSupplierById(id) {
    return this.suppliers.getSupplierById(id);
  }

  addSupplier(supplier) {
    return this.suppliers.addSupplier(supplier);
  }

  updateSupplier(id, supplier) {
    return this.suppliers.updateSupplier(id, supplier);
  }

  deleteSupplier(id) {
    return this.suppliers.deleteSupplier(id);
  }

//   calculateSupplierBalance(supplierId) {
//     return this.suppliers.calculateSupplierBalance(supplierId);
//   }

//   updateSupplierBalance(supplierId) {
//     return this.suppliers.updateSupplierBalance(supplierId);
//   }

//   getAllSales() {
//     return this.sales.getAllSales();
//   }

//   getSaleById(id) {
//     return this.sales.getSaleById(id);
//   }

//   addSale(sale) {
//     // استخدام العملية المتكاملة للمبيعات
//     return this.sales.completeSale(sale, this.products, this.customers);
//   }

//   updateSale(id, sale) {
//     return this.sales.updateSale(id, sale);
//   }

//   deleteSale(id) {
//     const sale = this.sales.getSaleById(id);
//     if (sale) {
//       // إذا كان هناك عميل، ارجع الرصيد
//       if (sale.customer_id) {
//         this.customers.addPaymentToCustomerBalance(
//           sale.customer_id,
//           sale.total
//         );
//       }
//       // ارجع المخزون
//       this.products.reverseSaleStock(id);
//     }
//     return this.sales.deleteSale(id);
//   }

//   processSalePayment(saleId, paymentAmount, paymentMethod = "cash") {
//     const result = this.sales.processSalePayment(
//       saleId,
//       paymentAmount,
//       paymentMethod
//     );

//     // إذا نجحت المعاملة، حدث رصيد العميل
//     if (result.success && result.sale.customer_id) {
//       this.customers.addPaymentToCustomerBalance(
//         result.sale.customer_id,
//         paymentAmount
//       );
//     }

//     return result;
//   }

//   // ============================
//   // CUSTOMER BALANCE METHODS
//   // ============================

//   calculateCustomerBalance(customerId) {
//     return this.customers.calculateCustomerBalance(customerId);
//   }

//   getCustomerWithBalance(customerId) {
//     const customer = this.customers.getCustomerById(customerId);
//     if (!customer) return null;

//     return {
//       ...customer,
//       balance: this.customers.calculateCustomerBalance(customerId),
//     };
//   }

//   getAllCustomersWithBalances() {
//     return this.customers.getCustomersWithBalance();
//   }



//    getAllPurchases() {
//     return this.purchaseHandler.getAllPurchases();
//   }

//   getPurchaseById(id) {
//     return this.purchaseHandler.getPurchaseById(id);
//   }

//   addPurchase(purchase) {
//     return this.purchaseHandler.addPurchase(purchase);
//   }

//   updatePurchase(id, purchase) {
//     return this.purchaseHandler.updatePurchase(id, purchase);
//   }

//   deletePurchase(id) {
//     return this.purchaseHandler.deletePurchase(id);
//   }

//   // عناصر المشتريات
//   getPurchaseItems() {
//     return this.purchaseHandler.getPurchaseItems();
//   }

//   getPurchaseItemsByPurchaseId(purchaseId) {
//     return this.purchaseHandler.getPurchaseItemsByPurchaseId(purchaseId);
//   }

//   addPurchaseItem(item) {
//     return this.purchaseHandler.addPurchaseItem(item);
//   }

//   updatePurchaseItem(id, item) {
//     return this.purchaseHandler.updatePurchaseItem(id, item);
//   }

//   deletePurchaseItems(purchaseId) {
//     return this.purchaseHandler.deletePurchaseItems(purchaseId);
//   }

//   clearPurchaseItems(purchaseId) {
//     return this.purchaseHandler.clearPurchaseItems(purchaseId);
//   }

//   // معالجة المشتريات
//   processPurchasePayment(purchaseId, amount, method = 'cash', notes = '') {
//     return this.purchaseHandler.processPurchasePayment(purchaseId, amount, method, notes);
//   }

//   completePurchase(purchaseData) {
//     return this.purchaseHandler.completePurchase(
//       purchaseData, 
//       this.productHandler, 
//       this // نمرر this كموردين مؤقتاً
//     );
//   }

//   // إحصائيات المشتريات
//   getPurchaseStatistics() {
//     return this.purchaseHandler.getPurchaseStatistics();
//   }

//   getAllPurchasesByDateRange(startDate, endDate) {
//     return this.purchaseHandler.getAllPurchasesByDateRange(startDate, endDate);
//   }

//   getAllPurchasesBySupplier(supplierId) {
//     return this.purchaseHandler.getAllPurchasesBySupplier(supplierId);
//   }

//   getTotalPurchasesByDate(date) {
//     return this.purchaseHandler.getTotalPurchasesByDate(date);
//   }


//   // ============================
//   // PAYMENT METHODS - دوال المدفوعات
//   // ============================

//   getPayments() {
//     return this.paymentHandler.getPayments();
//   }

//   addPayment(payment) {
//     return this.paymentHandler.addPayment(payment);
//   }

//   updatePayment(id, payment) {
//     return this.paymentHandler.updatePayment(id, payment);
//   }

//   deletePayment(id) {
//     return this.paymentHandler.deletePayment(id);
//   }

//   // الدفعات المستلمة
//   getPaymentsReceived() {
//     return this.paymentHandler.getPaymentsReceived();
//   }

//   addPaymentReceived(payment) {
//     return this.paymentHandler.addPaymentReceived(payment);
//   }

//   updatePaymentReceived(id, payment) {
//     return this.paymentHandler.updatePaymentReceived(id, payment);
//   }

//   deletePaymentReceived(id) {
//     return this.paymentHandler.deletePaymentReceived(id);
//   }

//   // مدفوعات الموردين
//   getSupplierPayments() {
//     return this.paymentHandler.getSupplierPayments();
//   }

//   addSupplierPayment(payment) {
//     return this.paymentHandler.addSupplierPayment(payment);
//   }

//   updateSupplierPayment(id, payment) {
//     return this.paymentHandler.updateSupplierPayment(id, payment);
//   }

//   deleteSupplierPayment(id) {
//     return this.paymentHandler.deleteSupplierPayment(id);
//   }

  // ... باقي الدوال
}

module.exports = {
  DatabaseHandler,
  CustomerHandler,
  EmployeeHandler,
  UsersHandler,
  ProductHandler,
  SupplierHandler,
  SaleHandler,
  PurchaseHandler,
  PaymentHandler,
  ExpenseHandler
};
