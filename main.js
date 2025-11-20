const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
// Import the new DatabaseService instead of the old DatabaseHandler
const DatabaseService = require("./database/handlers/index"); // Adjust path as needed

let db;
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    autoHideMenuBar: true, // Hide menu bar automatically
  });

  // Remove menu completely
  mainWindow.setMenuBarVisibility(false);

  mainWindow.maximize();
  mainWindow.loadFile(
    path.join(__dirname, "dist/app-electron/browser/index.html")
  );
}

// تهيئة قاعدة البيانات عند بدء التطبيق
app.whenReady().then(() => {
  // Use the new DatabaseService instead of DatabaseHandler
  db = new DatabaseService();
  setupIPCHandlers();
  createWindow();
});

// إعداد IPC handlers
function setupIPCHandlers() {
  // العملاء
  ipcMain.handle("db:getCustomers", async () => {
    return db.customers.getCustomers();
  });

  ipcMain.handle("db:addCustomer", async (event, customer) => {
    return db.customers.addCustomer(customer);
  });

  ipcMain.handle("db:updateCustomer", async (event, id, customer) => {
    return db.customers.updateCustomer(id, customer);
  });

  ipcMain.handle("db:deleteCustomer", async (event, id) => {
    return db.customers.deleteCustomer(id);
  });

  // الموردين
  ipcMain.handle("db:getSuppliers", async () => {
    return db.suppliers.getAllSuppliers();
  });

  ipcMain.handle("db:addSupplier", async (event, supplier) => {
    return db.suppliers.addSupplier(supplier);
  });

  ipcMain.handle("db:updateSupplier", async (event, id, supplier) => {
    return db.suppliers.updateSupplier(id, supplier);
  });

  ipcMain.handle("db:deleteSupplier", async (event, id) => {
    return db.suppliers.deleteSupplier(id);
  });

  // المنتجات
  ipcMain.handle("db:getProducts", async () => {
    return db.products.getProducts();
  });

  ipcMain.handle("db:addProduct", async (event, product) => {
    return db.products.addProduct(product);
  });

  ipcMain.handle("db:updateProduct", async (event, id, product) => {
    return db.products.updateProduct(id, product);
  });

  ipcMain.handle("db:deleteProduct", async (event, id) => {
    return db.products.deleteProduct(id);
  });

  // المبيعات
  ipcMain.handle("db:getSales", async () => {
    return db.sales.getAllSales();
  });

  ipcMain.handle("db:addSale", async (event, sale) => {
    try {
      const result = await db.sales.addSale(sale);
      return result;
    } catch (error) {
      console.error("❌ IPC: خطأ في إضافة الفاتورة:", error);
      return { changes: 0 };
    }
  });

  ipcMain.handle("db:updateSale", async (event, id, sale) => {
    try {
      const result = await db.sales.updateSale(id, sale);
      return result;
    } catch (error) {
      console.error("❌ IPC: خطأ في تحديث الفاتورة:", error);
      return { changes: 0 };
    }
  });

  ipcMain.handle("db:deleteSale", async (event, id) => {
    return db.sales.deleteSale(id);
  });

  ipcMain.handle("db:getSaleById", async (event, id) => {
    return db.sales.getSaleById(id);
  });

  // الموظفين
  ipcMain.handle("db:getEmployees", async () => {
    return db.employees.getEmployees();
  });

  ipcMain.handle("db:addEmployee", async (event, employee) => {
    return db.employees.addEmployee(employee);
  });

  ipcMain.handle("db:updateEmployee", async (event, id, employee) => {
    return db.employees.updateEmployee(id, employee);
  });

  ipcMain.handle("db:deleteEmployee", async (event, id) => {
    return db.employees.deleteEmployee(id);
  });

  // المشتريات
  ipcMain.handle("db:getPurchases", async () => {
    return db.purchases.getPurchases();
  });

  ipcMain.handle("db:addPurchase", async (event, purchase) => {
    return db.purchases.addPurchase(purchase);
  });

  ipcMain.handle("db:updatePurchase", async (event, id, purchase) => {
    return db.purchases.updatePurchase(id, purchase);
  });

  ipcMain.handle("db:deletePurchase", async (event, id) => {
    return db.purchases.deletePurchase(id);
  });

  // العملاءدفعات
  ipcMain.handle("db:getCustomerPayments", async () => {
    return await db.customerPayments.getAllCustomerPayments();
  });

  ipcMain.handle("db:addCustomerPayment", async (event, payment) => {
    return await db.customerPayments.addCustomerPaymentReceived(payment);
  });

  ipcMain.handle("db:updateCustomerPayment", async (event, id, payment) => {
    return await db.customerPayments.updateCustomerPayment(id, payment);
  });
  ipcMain.handle("db:deleteCustomerPayment", async (event, id) => {
    return await db.customerPayments.deleteCustomerPayment(id);
  });

// دفعات الموردين
  ipcMain.handle("db:getSupplierPayments", async () => {
  return await db.customerPayments.getSupplierPayments();
});

ipcMain.handle("db:addSupplierPayment", async (event, payment) => {
  return await db.customerPayments.addPaymentMade(payment);
});

ipcMain.handle("db:updateSupplierPayment", async (event, id, payment) => {
  return await db.customerPayments.updateSupplierPayment(id, payment);
});

ipcMain.handle("db:deleteSupplierPayment", async (event, id) => {
  return await db.customerPayments.deleteSupplierPayment(id);
});


  // المصروفات
  ipcMain.handle("db:getExpenses", async () => {
    return await db.expenses.getExpenses();
  });

  ipcMain.handle("db:addExpense", async (event, expense) => {
    return await db.expenses.addExpense(expense);
  });

  ipcMain.handle("db:updateExpense", async (event, id, expense) => {
    return await db.expenses.updateExpense(id, expense);
  });

  ipcMain.handle("db:deleteExpense", async (event, id) => {
    return await db.expenses.deleteExpense(id);
  });

  ipcMain.handle("db:getExpenseStats", async () => {
    return await db.expenses.getExpenseStats();
  });

  ipcMain.handle(
    "db:getExpensesByDateRange",
    async (event, startDate, endDate) => {
      return await db.expenses.getExpensesByDateRange(startDate, endDate);
    }
  );

  // المستخدمين
  ipcMain.handle("db:getUsers", async () => {
    return db.users.getUsers();
  });

  ipcMain.handle("db:addUser", async (event, user) => {
    return db.users.addUser(user);
  });

  ipcMain.handle("db:updateUser", async (event, id, user) => {
    return db.users.updateUser(id, user);
  });

  ipcMain.handle("db:deleteUser", async (event, id) => {
    return db.users.deleteUser(id);
  });

  // Authentication handler
  ipcMain.handle("db:authenticateUser", async (event, username, password) => {
    return db.users.authenticateUser(username, password);
  });

  // Dashboard stats
  ipcMain.handle("db:getDashboardStats", async () => {
    return db.getDashboardStats();
  });
}

app.on("window-all-closed", () => {
  if (db) {
    db.close();
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
