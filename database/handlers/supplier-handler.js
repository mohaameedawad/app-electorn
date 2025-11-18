const BaseHandler = require('./base-handler');

class SupplierHandler extends BaseHandler {
  // ============================
  // SUPPLIER METHODS
  // ============================
  
  getAllSuppliers() {
    if (!this.data.suppliers) {
      this.data.suppliers = [];
    }
    return this.data.suppliers;
  }

  getSupplierById(id) {
    if (!this.data.suppliers) return null;
    return this.data.suppliers.find(s => s.id === id);
  }

  addSupplier(supplier) {
    if (!this.data.suppliers) {
      this.data.suppliers = [];
    }
    
    const id = this._getNextId("suppliers");
    const newSupplier = {
      id,
      name: supplier.name || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
      email: supplier.email || '',
      balance: supplier.balance || 0,
      notes: supplier.notes || '',
      is_active: supplier.is_active !== undefined ? supplier.is_active : true,
      created_at: new Date().toISOString(),
      ...supplier
    };

    this.data.suppliers.push(newSupplier);
    this.saveData();
    return { lastInsertRowid: id, changes: 1, row: newSupplier };
  }

  updateSupplier(id, supplier) {
    if (!this.data.suppliers) {
      this.data.suppliers = [];
    }
    
    const idx = this.data.suppliers.findIndex(s => s.id === id);
    if (idx === -1) return { changes: 0 };

    this.data.suppliers[idx] = {
      ...this.data.suppliers[idx],
      ...supplier,
      id: this.data.suppliers[idx].id // الحفاظ على الـ ID الأصلي
    };

    this.saveData();
    return { changes: 1, row: this.data.suppliers[idx] };
  }

  deleteSupplier(id) {
    if (!this.data.suppliers) {
      this.data.suppliers = [];
    }
    
    const idx = this.data.suppliers.findIndex(s => s.id === id);
    if (idx === -1) return { changes: 0 };

    this.data.suppliers.splice(idx, 1);
    this.saveData();
    return { changes: 1 };
  }

//   // ============================
//   // SUPPLIER BALANCE MANAGEMENT
//   // ============================
  
//   calculateSupplierBalance(supplierId) {
//     const supplier = this.getSupplierById(supplierId);
//     if (!supplier) return 0;

//     // حساب الرصيد من المشتريات والمدفوعات
//     const purchases = this.data.purchases?.filter(p => p.supplier_id === supplierId) || [];
//     const payments = this.data.payments_made?.filter(p => p.supplier_id === supplierId) || [];
//     const returns = this.data.purchase_returns?.filter(r => r.supplier_id === supplierId) || [];

//     const totalPurchases = purchases.reduce((sum, p) => sum + (p.total || 0), 0);
//     const totalPayments = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
//     const totalReturns = returns.reduce((sum, r) => sum + (r.total_refund || 0), 0);

//     // الرصيد = المشتريات - (المدفوعات + المرتجعات)
//     const balance = totalPurchases - (totalPayments + totalReturns);
//     return balance;
//   }

//   updateSupplierBalance(supplierId) {
//     const supplier = this.getSupplierById(supplierId);
//     if (!supplier) return;

//     supplier.balance = this.calculateSupplierBalance(supplierId);
//     this.saveData();
//   }

//   // ============================
//   // SEARCH AND FILTER
//   // ============================
  
//   searchSuppliers(searchTerm) {
//     if (!this.data.suppliers) return [];
    
//     const term = searchTerm.toLowerCase();
//     return this.data.suppliers.filter(supplier => 
//       supplier.name?.toLowerCase().includes(term) ||
//       supplier.phone?.includes(term) ||
//       supplier.email?.toLowerCase().includes(term)
//     );
//   }

//   getActiveSuppliers() {
//     if (!this.data.suppliers) return [];
//     return this.data.suppliers.filter(supplier => supplier.is_active !== false);
//   }
}

module.exports = SupplierHandler;

