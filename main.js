const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const DatabaseHandler = require('./database');

let db;

function createWindow() {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    autoHideMenuBar: true // Hide menu bar automatically
  });

  // Remove menu completely
  win.setMenuBarVisibility(false);

  win.maximize();
  win.loadFile(path.join(__dirname, 'dist/app-electron/browser/index.html'));
}

// تهيئة قاعدة البيانات عند بدء التطبيق
app.whenReady().then(() => {
  db = new DatabaseHandler();
  setupIPCHandlers();
  createWindow();
});

// إعداد IPC handlers
function setupIPCHandlers() {
  // العملاء
  ipcMain.handle('db:getCustomers', async () => {
    const customers = db.getAllCustomers();
    return customers;
  });

  ipcMain.handle('db:addCustomer', async (event, customer) => {
    return db.addCustomer(customer);
  });

  ipcMain.handle('db:updateCustomer', async (event, id, customer) => {
    return db.updateCustomer(id, customer);
  });

  ipcMain.handle('db:deleteCustomer', async (event, id) => {
    return db.deleteCustomer(id);
  });

  // الموردين
  ipcMain.handle('db:getSuppliers', async () => {
    return db.getAllSuppliers();
  });

  ipcMain.handle('db:addSupplier', async (event, supplier) => {
    return db.addSupplier(supplier);
  });

  ipcMain.handle('db:updateSupplier', async (event, id, supplier) => {
    return db.updateSupplier(id, supplier);
  });

  ipcMain.handle('db:deleteSupplier', async (event, id) => {
    return db.deleteSupplier(id);
  });

  // المنتجات
  ipcMain.handle('db:getProducts', async () => {
    return db.getAllProducts();
  });

  ipcMain.handle('db:addProduct', async (event, product) => {
    return db.addProduct(product);
  });

  ipcMain.handle('db:updateProduct', async (event, id, product) => {
    return db.updateProduct(id, product);
  });

  ipcMain.handle('db:deleteProduct', async (event, id) => {
    return db.deleteProduct(id);
  });

  // المبيعات
  ipcMain.handle('db:getSales', async () => {
    return db.getAllSales();
  });

  ipcMain.handle('db:addSale', async (event, sale) => {
    return db.addSale(sale);
  });

  ipcMain.handle('db:updateSale', async (event, id, sale) => {
    return db.updateSale(id, sale);
  });

  ipcMain.handle('db:deleteSale', async (event, id) => {
    return db.deleteSale(id);
  });

  // الموظفين
  ipcMain.handle('db:getEmployees', async () => {
    return db.getEmployees();
  });

  ipcMain.handle('db:addEmployee', async (event, employee) => {
    return db.addEmployee(employee);
  });

  ipcMain.handle('db:updateEmployee', async (event, id, employee) => {
    return db.updateEmployee(id, employee);
  });

  ipcMain.handle('db:deleteEmployee', async (event, id) => {
    return db.deleteEmployee(id);
  });

  // المشتريات
  ipcMain.handle('db:getPurchases', async () => {
    return db.getPurchases();
  });

  ipcMain.handle('db:addPurchase', async (event, purchase) => {
    return db.addPurchase(purchase);
  });

  ipcMain.handle('db:updatePurchase', async (event, id, purchase) => {
    return db.updatePurchase(id, purchase);
  });

  ipcMain.handle('db:deletePurchase', async (event, id) => {
    return db.deletePurchase(id);
  });

  // المدفوعات
  ipcMain.handle('db:getPayments', async () => {
    return db.getPayments();
  });

  ipcMain.handle('db:addPayment', async (event, payment) => {
    return db.addPayment(payment);
  });

  ipcMain.handle('db:updatePayment', async (event, id, payment) => {
    return db.updatePayment(id, payment);
  });

  ipcMain.handle('db:deletePayment', async (event, id) => {
    return db.deletePayment(id);
  });

  // المصروفات
  ipcMain.handle('db:getExpenses', async () => {
    return db.getExpenses();
  });

  ipcMain.handle('db:addExpense', async (event, expense) => {
    return db.addExpense(expense);
  });

  ipcMain.handle('db:updateExpense', async (event, id, expense) => {
    return db.updateExpense(id, expense);
  });

  ipcMain.handle('db:deleteExpense', async (event, id) => {
    return db.deleteExpense(id);
  });

  // المستخدمين
  ipcMain.handle('db:getUsers', async () => {
    return db.getUsers();
  });

  ipcMain.handle('db:addUser', async (event, user) => {
    return db.addUser(user);
  });

  ipcMain.handle('db:updateUser', async (event, id, user) => {
    return db.updateUser(id, user);
  });

  ipcMain.handle('db:deleteUser', async (event, id) => {
    return db.deleteUser(id);
  });
}


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});