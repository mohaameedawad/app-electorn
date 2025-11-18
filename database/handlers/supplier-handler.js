const BaseHandler = require('./base-handler');

class SupplierHandler extends BaseHandler {
  getAllSuppliers() {
    return this.data.suppliers || [];
  }

  getSupplierById(id) {
    return this.getAllSuppliers().find(s => s.id === id);
  }

  addSupplier(supplier) {
    if (!this.data.suppliers) this.data.suppliers = [];
    
    const newSupplier = {
      id: this._getNextId('suppliers'),
      ...supplier,
      createdAt: new Date().toISOString(),
      balance: supplier.balance || 0
    };
    
    this.data.suppliers.push(newSupplier);
    this.saveData();
    return { lastInsertRowid: newSupplier.id, changes: 1 };
  }

  updateSupplier(id, supplier) {
    const index = this.getAllSuppliers().findIndex(s => s.id === id);
    if (index !== -1) {
      this.data.suppliers[index] = { 
        ...this.data.suppliers[index], 
        ...supplier,
        updatedAt: new Date().toISOString()
      };
      this.saveData();
      return { changes: 1 };
    }
    return { changes: 0 };
  }

  deleteSupplier(id) {
    const initialLength = this.getAllSuppliers().length;
    this.data.suppliers = this.getAllSuppliers().filter(s => s.id !== id);
    this.saveData();
    return { changes: initialLength - this.getAllSuppliers().length };
  }

  updateSupplierBalance(id, amount) {
    const supplier = this.getSupplierById(id);
    if (supplier) {
      supplier.balance = (supplier.balance || 0) + amount;
      this.saveData();
      return true;
    }
    return false;
  }
}

module.exports = SupplierHandler;