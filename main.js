const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { DatabaseHandler } = require("./database/handlers"); // المسار الجديد

let db;

function createWindow() {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    autoHideMenuBar: true,
  });

  win.setMenuBarVisibility(false);
  win.maximize();
  win.loadFile(path.join(__dirname, "dist/app-electron/browser/index.html"));
}

app.whenReady().then(() => {
  db = new DatabaseHandler();
  setupIPCHandlers();
  createWindow();
});

function setupIPCHandlers() {
  // العملاء
  ipcMain.handle("db:getAllCustomers", async () => {
    return db.getAllCustomers();
  });

  ipcMain.handle("db:addCustomer", async (event, customer) => {
    return db.addCustomer(customer);
  });

  ipcMain.handle("db:updateCustomer", async (event, id, customer) => {
    return db.updateCustomer(id, customer);
  });

  ipcMain.handle("db:deleteCustomer", async (event, id) => {
    return db.deleteCustomer(id);
  });

//   // الموظفين
//   ipcMain.handle("db:getAllEmployees", async () => {
//     return db.getAllEmployees();
//   });

//   ipcMain.handle("db:addEmployee", async (event, employee) => {
//     return db.addEmployee(employee);
//   });

//   ipcMain.handle("db:updateEmployee", async (event, id, employee) => {
//     return db.updateEmployee(id, employee);
//   });

//   ipcMain.handle("db:deleteEmployee", async (event, id) => {
//     return db.deleteEmployee(id);
//   });

  // الموردين
  ipcMain.handle("db:getAllSuppliers", async () => {
    return db.getAllSuppliers();
  });

  ipcMain.handle("db:addSupplier", async (event, supplier) => {
    return db.addSupplier(supplier);
  });

  ipcMain.handle("db:updateSupplier", async (event, id, supplier) => {
    return db.updateSupplier(id, supplier);
  });

  ipcMain.handle("db:deleteSupplier", async (event, id) => {
    return db.deleteSupplier(id);
  });

  ipcMain.handle("db:getSupplierById", async (event, id) => {
    return db.getSupplierById(id);
  });

//   // المنتجات
//   ipcMain.handle("db:getAllProducts", async () => {
//     return db.getAllProducts();
//   });

//   ipcMain.handle("db:addProduct", async (event, product) => {
//     return db.addProduct(product);
//   });

//   ipcMain.handle("db:updateProduct", async (event, id, product) => {
//     return db.updateProduct(id, product);
//   });

//   ipcMain.handle("db:deleteProduct", async (event, id) => {
//     return db.deleteProduct(id);
//   });

//   ipcMain.handle("db:getProductById", async (event, id) => {
//     return db.getProductById(id);
//   });

//   // المخزون
//   ipcMain.handle("db:calculateProductStock", async (event, productId) => {
//     return db.calculateProductStock(productId);
//   });

//   ipcMain.handle("db:validateStockForSale", async (event, items) => {
//     return db.validateStockForSale(items);
//   });

//   ipcMain.handle(
//     "db:adjustStock",
//     async (event, productId, newStock, reason) => {
//       return db.adjustStock(productId, newStock, reason);
//     }
//   );

//   // الفئات
//   ipcMain.handle("db:getAllCategories", async () => {
//     return db.getAllCategories();
//   });

//   ipcMain.handle("db:addCategory", async (event, category) => {
//     return db.addCategory(category);
//   });

//   ipcMain.handle("db:updateCategory", async (event, id, category) => {
//     return db.updateCategory(id, category);
//   });

//   ipcMain.handle("db:deleteCategory", async (event, id) => {
//     return db.deleteCategory(id);
//   });

//   // المبيعات
//  ipcMain.handle("db:getAllSales", async () => {
//   return db.getAllSales();
// });

// ipcMain.handle("db:addSale", async (event, sale) => {
//   return db.addSale(sale);
// });

// ipcMain.handle("db:updateSale", async (event, id, sale) => {
//   return db.updateSale(id, sale);
// });

// ipcMain.handle("db:deleteSale", async (event, id) => {
//   return db.deleteSale(id);
// });

// ipcMain.handle("db:processSalePayment", async (event, saleId, amount, method) => {
//   return db.processSalePayment(saleId, amount, method);
// });

// // أرصدة العملاء
// ipcMain.handle("db:calculateCustomerBalance", async (event, customerId) => {
//   return db.calculateCustomerBalance(customerId);
// });

// ipcMain.handle("db:getCustomerWithBalance", async (event, customerId) => {
//   return db.getCustomerWithBalance(customerId);
// });

// ipcMain.handle("db:getAllCustomersWithBalances", async () => {
//   return db.getAllCustomersWithBalances();
// });

//   // المشتريات
//   ipcMain.handle("db:getAllPurchases", async () => {
//     return db.getAllPurchases();
//   });


//   // الدفعات
//   ipcMain.handle("db:getPayments", async () => {
//     return db.getPayments();
//   });

//   ipcMain.handle("db:addPayment", async (event, payment) => {
//     return db.addPayment(payment);
//   });

//   ipcMain.handle("db:updatePayment", async (event, id, payment) => {
//     return db.updatePayment(id, payment);
//   });

//   ipcMain.handle("db:deletePayment", async (event, id) => {
//     return db.deletePayment(id);
//   });

//   // المصروفات
//   ipcMain.handle("db:getExpenses", async () => {
//     return db.getExpenses();
//   });

//   ipcMain.handle("db:addExpense", async (event, expense) => {
//     return db.addExpense(expense);
//   });

//   ipcMain.handle("db:updateExpense", async (event, id, expense) => {
//     return db.updateExpense(id, expense);
//   });

//   ipcMain.handle("db:deleteExpense", async (event, id) => {
//     return db.deleteExpense(id);
//   });

  ipcMain.handle("db:getAllUsers", async () => {
    return db.getAllUsers();
  });

  ipcMain.handle("db:addUser", async (event, user) => {
    return db.addUser(user);
  });

  ipcMain.handle("db:updateUser", async (event, id, user) => {
    return db.updateUser(id, user);
  });

  ipcMain.handle("db:deleteUser", async (event, id) => {
    return db.deleteUser(id);
  });

  ipcMain.handle("db:getUserById", async (event, id) => {
    return db.getUserById(id);
  });


  ipcMain.handle("db:authenticateUser", async (event, username, password) => {
    return db.authenticateUser(username, password);
  });

  ipcMain.handle("db:changePassword", async (event, id, newPassword) => {
    return db.changePassword(id, newPassword);
  });

  ipcMain.handle("db:deactivateUser", async (event, id) => {
    return db.deactivateUser(id);
  });

  ipcMain.handle("db:activateUser", async (event, id) => {
    return db.activateUser(id);
  });



//   ipcMain.handle("db:getSaleItemsBySaleId", async (event, saleId) => {
//   return db.getSaleItemsBySaleId(saleId);
// });

// ipcMain.handle("db:addSaleItem", async (event, saleItem) => {
//   return db.addSaleItem(saleItem);
// });

// ipcMain.handle("db:updateSaleItem", async (event, id, saleItem) => {
//   return db.updateSaleItem(id, saleItem);
// });

// ipcMain.handle("db:deleteSaleItems", async (event, saleId) => {
//   return db.deleteSaleItems(saleId);
// });

// // حركات المخزون
// ipcMain.handle("db:getStockMovements", async () => {
//   return db.getStockMovements();
// });

// ipcMain.handle("db:addStockMovement", async (event, movement) => {
//   return db.addStockMovement(movement);
// });

// // الدفعات المستلمة (مدفوعات العملاء)
// ipcMain.handle("db:getPaymentsReceived", async () => {
//   return db.getPaymentsReceived();
// });

// ipcMain.handle("db:addPaymentReceived", async (event, payment) => {
//   return db.addPaymentReceived(payment);
// });

// ipcMain.handle("db:updatePaymentReceived", async (event, id, payment) => {
//   return db.updatePaymentReceived(id, payment);
// });

// ipcMain.handle("db:deletePaymentReceived", async (event, id) => {
//   return db.deletePaymentReceived(id);
// });

// // مدفوعات الموردين
// ipcMain.handle("db:getSupplierPayments", async () => {
//   return db.getSupplierPayments();
// });

// ipcMain.handle("db:addSupplierPayment", async (event, payment) => {
//   return db.addSupplierPayment(payment);
// });

// ipcMain.handle("db:updateSupplierPayment", async (event, id, payment) => {
//   return db.updateSupplierPayment(id, payment);
// });

// ipcMain.handle("db:deleteSupplierPayment", async (event, id) => {
//   return db.deleteSupplierPayment(id);
// });

// // مرتجعات المبيعات
// ipcMain.handle("db:getAllSalesReturns", async () => {
//   return db.getAllSalesReturns();
// });

// ipcMain.handle("db:addSalesReturn", async (event, data) => {
//   return db.addSalesReturn(data);
// });

// // الحصول على المنتج (إذا كانت getProductById لا تكفي)
// ipcMain.handle("db:getProduct", async (event, id) => {
//   return db.getProductById(id); // أو إنشاء دالة getProduct منفصلة
// });


// // عناصر فواتير المشتريات
// ipcMain.handle("db:getPurchaseItems", async () => {
//   return db.getPurchaseItems();
// });

// ipcMain.handle("db:getPurchaseItemsByPurchaseId", async (event, purchaseId) => {
//   return db.getPurchaseItemsByPurchaseId(purchaseId);
// });

// ipcMain.handle("db:addPurchaseItem", async (event, item) => {
//   return db.addPurchaseItem(item);
// });

// ipcMain.handle("db:updatePurchaseItem", async (event, id, item) => {
//   return db.updatePurchaseItem(id, item);
// });

// ipcMain.handle("db:deletePurchaseItems", async (event, purchaseId) => {
//   return db.deletePurchaseItems(purchaseId);
// });

// ipcMain.handle("db:clearPurchaseItems", async (event, purchaseId) => {
//   return db.clearPurchaseItems(purchaseId);
// });

// // أرصدة الموردين
// ipcMain.handle("db:calculateSupplierBalance", async (event, supplierId) => {
//   return db.calculateSupplierBalance(supplierId);
// });

// ipcMain.handle("db:getSupplierWithBalance", async (event, supplierId) => {
//   return db.getSupplierWithBalance(supplierId);
// });

// ipcMain.handle("db:getAllSuppliersWithBalances", async () => {
//   return db.getAllSuppliersWithBalances();
// });



// ipcMain.handle("db:addPurchase", async (event, purchase) => {
//   return db.addPurchase(purchase);
// });

// ipcMain.handle("db:updatePurchase", async (event, id, purchase) => {
//   return db.updatePurchase(id, purchase);
// });

// ipcMain.handle("db:deletePurchase", async (event, id) => {
//   return db.deletePurchase(id);
// });

// ipcMain.handle("db:getPurchaseById", async (event, id) => {
//   return db.getPurchaseById(id);
// });

// // معالجة دفعات المشتريات
// ipcMain.handle("db:processPurchasePayment", async (event, purchaseId, amount, method, notes) => {
//   return db.processPurchasePayment(purchaseId, amount, method, notes);
// });

// // عملية شراء كاملة
// ipcMain.handle("db:completePurchase", async (event, purchaseData) => {
//   return db.completePurchase(purchaseData);
// });


}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
