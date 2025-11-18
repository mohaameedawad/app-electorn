const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
//   // العملاء
  getAllCustomers: () => ipcRenderer.invoke("db:getAllCustomers"),
  addCustomer: (customer) => ipcRenderer.invoke("db:addCustomer", customer),
  updateCustomer: (id, customer) =>
    ipcRenderer.invoke("db:updateCustomer", id, customer),
  deleteCustomer: (id) => ipcRenderer.invoke("db:deleteCustomer", id),

//   // الموظفين
//   getAllEmployees: () => ipcRenderer.invoke("db:getAllEmployees"),
//   addEmployee: (employee) => ipcRenderer.invoke("db:addEmployee", employee),
//   updateEmployee: (id, employee) =>
//     ipcRenderer.invoke("db:updateEmployee", id, employee),
//   deleteEmployee: (id) => ipcRenderer.invoke("db:deleteEmployee", id),

  // الموردين
  getAllSuppliers: () => ipcRenderer.invoke("db:getAllSuppliers"),
  addSupplier: (supplier) => ipcRenderer.invoke("db:addSupplier", supplier),
  updateSupplier: (id, supplier) =>
    ipcRenderer.invoke("db:updateSupplier", id, supplier),
  deleteSupplier: (id) => ipcRenderer.invoke("db:deleteSupplier", id),

//   // المنتجات
//   // المنتجات
//   getAllProducts: () => ipcRenderer.invoke("db:getAllProducts"),
//   addProduct: (product) => ipcRenderer.invoke("db:addProduct", product),
//   updateProduct: (id, product) =>
//     ipcRenderer.invoke("db:updateProduct", id, product),
//   deleteProduct: (id) => ipcRenderer.invoke("db:deleteProduct", id),
//   getProductById: (id) => ipcRenderer.invoke("db:getProductById", id),

//   // المخزون
//   calculateProductStock: (productId) =>
//     ipcRenderer.invoke("db:calculateProductStock", productId),
//   validateStockForSale: (items) =>
//     ipcRenderer.invoke("db:validateStockForSale", items),
//   adjustStock: (productId, newStock, reason) =>
//     ipcRenderer.invoke("db:adjustStock", productId, newStock, reason),

//   // الفئات
//   getAllCategories: () => ipcRenderer.invoke("db:getAllCategories"),
//   addCategory: (category) => ipcRenderer.invoke("db:addCategory", category),
//   updateCategory: (id, category) =>
//     ipcRenderer.invoke("db:updateCategory", id, category),
//   deleteCategory: (id) => ipcRenderer.invoke("db:deleteCategory", id),

//   // المبيعات
//   getAllSales: () => ipcRenderer.invoke("db:getAllSales"),
//   addSale: (sale) => ipcRenderer.invoke("db:addSale", sale),
//   updateSale: (id, sale) => ipcRenderer.invoke("db:updateSale", id, sale),
//   deleteSale: (id) => ipcRenderer.invoke("db:deleteSale", id),
//   processSalePayment: (saleId, amount, method) =>
//     ipcRenderer.invoke("db:processSalePayment", saleId, amount, method),

//   // أرصدة العملاء
//   calculateCustomerBalance: (customerId) =>
//     ipcRenderer.invoke("db:calculateCustomerBalance", customerId),
//   getCustomerWithBalance: (customerId) =>
//     ipcRenderer.invoke("db:getCustomerWithBalance", customerId),
//   getAllCustomersWithBalances: () =>
//     ipcRenderer.invoke("db:getAllCustomersWithBalances"),

//   // الدفعات
//   getPayments: () => ipcRenderer.invoke("db:getPayments"),
//   addPayment: (payment) => ipcRenderer.invoke("db:addPayment", payment),
//   updatePayment: (id, payment) =>
//     ipcRenderer.invoke("db:updatePayment", id, payment),
//   deletePayment: (id) => ipcRenderer.invoke("db:deletePayment", id),

//   // المصروفات
//   getExpenses: () => ipcRenderer.invoke("db:getExpenses"),
//   addExpense: (expense) => ipcRenderer.invoke("db:addExpense", expense),
//   updateExpense: (id, expense) =>
//     ipcRenderer.invoke("db:updateExpense", id, expense),
//   deleteExpense: (id) => ipcRenderer.invoke("db:deleteExpense", id),

//   // المستخدمين
  getAllUsers: () => ipcRenderer.invoke("db:getAllUsers"),
  addUser: (user) => ipcRenderer.invoke("db:addUser", user),
  updateUser: (id, user) => ipcRenderer.invoke("db:updateUser", id, user),
  deleteUser: (id) => ipcRenderer.invoke("db:deleteUser", id),

//   getSaleItemsBySaleId: (saleId) =>
//     ipcRenderer.invoke("db:getSaleItemsBySaleId", saleId),
//   addSaleItem: (saleItem) => ipcRenderer.invoke("db:addSaleItem", saleItem),
//   updateSaleItem: (id, saleItem) =>
//     ipcRenderer.invoke("db:updateSaleItem", id, saleItem),
//   deleteSaleItems: (saleId) => ipcRenderer.invoke("db:deleteSaleItems", saleId),

//   // حركات المخزون
//   getStockMovements: () => ipcRenderer.invoke("db:getStockMovements"),
//   addStockMovement: (movement) =>
//     ipcRenderer.invoke("db:addStockMovement", movement),

//   // عناصر فواتير الشراء
//   addPurchaseItem: (item) => ipcRenderer.invoke("db:addPurchaseItem", item),
//   clearPurchaseItems: (purchaseId) =>
//     ipcRenderer.invoke("db:clearPurchaseItems", purchaseId),

//   // الدفعات المستلمة
//   getPaymentsReceived: () => ipcRenderer.invoke("db:getPaymentsReceived"),
//   addPaymentReceived: (payment) =>
//     ipcRenderer.invoke("db:addPaymentReceived", payment),
//   updatePaymentReceived: (id, payment) =>
//     ipcRenderer.invoke("db:updatePaymentReceived", id, payment),
//   deletePaymentReceived: (id) =>
//     ipcRenderer.invoke("db:deletePaymentReceived", id),

//   // مدفوعات الموردين
//   getSupplierPayments: () => ipcRenderer.invoke("db:getSupplierPayments"),
//   addSupplierPayment: (payment) =>
//     ipcRenderer.invoke("db:addSupplierPayment", payment),
//   updateSupplierPayment: (id, payment) =>
//     ipcRenderer.invoke("db:updateSupplierPayment", id, payment),
//   deleteSupplierPayment: (id) =>
//     ipcRenderer.invoke("db:deleteSupplierPayment", id),

//   // مرتجعات المبيعات
//   getAllSalesReturns: () => ipcRenderer.invoke("db:getAllSalesReturns"),
//   addSalesReturn: (data) => ipcRenderer.invoke("db:addSalesReturn", data),

//   // الحصول على المنتج
//   getProduct: (id) => ipcRenderer.invoke("db:getProduct", id),


//   // فواتير المشتريات
// getAllPurchases: () => ipcRenderer.invoke("db:getAllPurchases"),
// addPurchase: (purchase) => ipcRenderer.invoke("db:addPurchase", purchase),
// updatePurchase: (id, purchase) => ipcRenderer.invoke("db:updatePurchase", id, purchase),
// deletePurchase: (id) => ipcRenderer.invoke("db:deletePurchase", id),

// // عناصر فواتير المشتريات
// getPurchaseItems: () => ipcRenderer.invoke("db:getPurchaseItems"),
// getPurchaseItemsByPurchaseId: (purchaseId) => ipcRenderer.invoke("db:getPurchaseItemsByPurchaseId", purchaseId),
// addPurchaseItem: (item) => ipcRenderer.invoke("db:addPurchaseItem", item),
// updatePurchaseItem: (id, item) => ipcRenderer.invoke("db:updatePurchaseItem", id, item),
// deletePurchaseItems: (purchaseId) => ipcRenderer.invoke("db:deletePurchaseItems", purchaseId),
// clearPurchaseItems: (purchaseId) => ipcRenderer.invoke("db:clearPurchaseItems", purchaseId),

// // أرصدة الموردين
// calculateSupplierBalance: (supplierId) => ipcRenderer.invoke("db:calculateSupplierBalance", supplierId),
// getSupplierWithBalance: (supplierId) => ipcRenderer.invoke("db:getSupplierWithBalance", supplierId),
// getAllSuppliersWithBalances: () => ipcRenderer.invoke("db:getAllSuppliersWithBalances"),
});
