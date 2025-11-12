const { contextBridge, ipcRenderer } = require('electron');

// تعريف API آمنة للتواصل مع main process
contextBridge.exposeInMainWorld('electronAPI', {
  // العملاء
  getCustomers: () => ipcRenderer.invoke('db:getCustomers'),
  addCustomer: (customer) => ipcRenderer.invoke('db:addCustomer', customer),
  updateCustomer: (id, customer) => ipcRenderer.invoke('db:updateCustomer', id, customer),
  deleteCustomer: (id) => ipcRenderer.invoke('db:deleteCustomer', id),

  // الموردين
  getSuppliers: () => ipcRenderer.invoke('db:getSuppliers'),
  addSupplier: (supplier) => ipcRenderer.invoke('db:addSupplier', supplier),
  updateSupplier: (id, supplier) => ipcRenderer.invoke('db:updateSupplier', id, supplier),
  deleteSupplier: (id) => ipcRenderer.invoke('db:deleteSupplier', id),

  // المنتجات
  getProducts: () => ipcRenderer.invoke('db:getProducts'),
  addProduct: (product) => ipcRenderer.invoke('db:addProduct', product),
  updateProduct: (id, product) => ipcRenderer.invoke('db:updateProduct', id, product),
  deleteProduct: (id) => ipcRenderer.invoke('db:deleteProduct', id),

  // المبيعات
  getSales: () => ipcRenderer.invoke('db:getSales'),
  addSale: (sale) => ipcRenderer.invoke('db:addSale', sale),
  updateSale: (id, sale) => ipcRenderer.invoke('db:updateSale', id, sale),
  deleteSale: (id) => ipcRenderer.invoke('db:deleteSale', id),

  // الموظفين
  getEmployees: () => ipcRenderer.invoke('db:getEmployees'),
  addEmployee: (employee) => ipcRenderer.invoke('db:addEmployee', employee),
  updateEmployee: (id, employee) => ipcRenderer.invoke('db:updateEmployee', id, employee),
  deleteEmployee: (id) => ipcRenderer.invoke('db:deleteEmployee', id),

  // المشتريات
  getPurchases: () => ipcRenderer.invoke('db:getPurchases'),
  addPurchase: (purchase) => ipcRenderer.invoke('db:addPurchase', purchase),
  updatePurchase: (id, purchase) => ipcRenderer.invoke('db:updatePurchase', id, purchase),
  deletePurchase: (id) => ipcRenderer.invoke('db:deletePurchase', id),
});
