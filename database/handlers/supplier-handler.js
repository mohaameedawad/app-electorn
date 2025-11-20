const BaseHandler = require("./base-handler");

class SupplierHandler extends BaseHandler {
  getAllSuppliers() {
    return this.data.suppliers || [];
  }

  getSupplierById(id) {
    return this.getAllSuppliers().find((s) => s.id === id);
  }

  addSupplier(supplier) {
    if (!this.data.suppliers) this.data.suppliers = [];
    
    const newSupplier = {
      id: this._getNextId('suppliers'),
      ...supplier,
      createdAt: new Date().toISOString(),
      balance: supplier.balance || 0,
    };
    
    this.data.suppliers.push(newSupplier);
    this.saveData();
    return { lastInsertRowid: newSupplier.id, changes: 1 };
  }

  updateSupplier(id, supplier) {
    const index = this.getAllSuppliers().findIndex((s) => s.id === id);
    if (index !== -1) {
      this.data.suppliers[index] = {
        ...this.data.suppliers[index],
        ...supplier,
        updatedAt: new Date().toISOString(),
      };
      this.saveData();
      return { changes: 1 };
    }
    return { changes: 0 };
  }

  deleteSupplier(id) {
    const before = this.getAllSuppliers().length;
    this.data.suppliers = this.getAllSuppliers().filter((s) => s.id !== id);
    this.saveData();
    return { changes: before - this.getAllSuppliers().length };
  }

  // تحديث الرصيد (يستخدمه: PurchaseHandler + SupplierPaymentHandler)
  updateSupplierBalance(id, amount) {
    const supplier = this.getSupplierById(id);
    if (!supplier) return false;

    supplier.balance = (supplier.balance || 0) + amount;
    this.saveData();
    return true;
  }

  // حساب رصيد المورد النهائي
  calculateSupplierBalance(id) {
    if (!this.data.purchases) this.data.purchases = [];
    if (!this.data.payments_made) this.data.payments_made = [];

    const purchases = this.data.purchases.filter(
      (p) => p.supplier_id === id
    );

    const payments = this.data.payments_made.filter(
      (pm) => pm.supplierId === id
    );

    const totalPurchases = purchases.reduce(
      (sum, p) => sum + (p.total || 0) - (p.paid_amount || 0),
      0
    );

    const totalPayments = payments.reduce(
      (sum, pm) => sum + (pm.amount || 0),
      0
    );

    return {
      credit: Math.max(totalPurchases - totalPayments, 0), // له
      debit: Math.max(totalPayments - totalPurchases, 0),  // عليه
    };
  }
}

module.exports = SupplierHandler;