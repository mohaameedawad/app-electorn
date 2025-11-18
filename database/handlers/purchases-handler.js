const BaseHandler = require('./base-handler');

class PurchaseHandler extends BaseHandler {
  getPurchases() {
    if (!this.data.purchases) {
      this.data.purchases = [];
    }
    return this.data.purchases;
  }

  getPurchaseById(id) {
    return this.getPurchases().find(p => p.id === id);
  }

  getPurchaseItems(purchaseId) {
    return (this.data.purchase_items || []).filter(item => item.purchase_id === purchaseId);
  }

  addPurchase(purchase) {
    if (!this.data.purchases) {
      this.data.purchases = [];
    }
    if (!this.data.purchase_items) {
      this.data.purchase_items = [];
    }
    
    const newPurchase = {
      id: this._getNextId('purchases'),
      ...purchase,
      createdAt: new Date().toISOString(),
      status: purchase.status || 'completed'
    };
    
    this.data.purchases.push(newPurchase);
    
    // Add purchase items
    if (purchase.items && Array.isArray(purchase.items)) {
      purchase.items.forEach(item => {
        const newItem = {
          id: this._getNextId('purchase_items'),
          purchase_id: newPurchase.id,
          ...item
        };
        this.data.purchase_items.push(newItem);
      });
    }
    
    this.saveData();
    return newPurchase;
  }

  updatePurchase(id, purchase) {
    const index = this.getPurchases().findIndex(p => p.id === id);
    if (index !== -1) {
      this.data.purchases[index] = { 
        ...this.data.purchases[index], 
        ...purchase,
        updatedAt: new Date().toISOString()
      };
      this.saveData();
      return this.data.purchases[index];
    }
    return null;
  }     

  deletePurchase(id) {
    const initialLength = this.getPurchases().length;
    this.data.purchases = this.getPurchases().filter(p => p.id !== id);
    // Also delete related purchase items
    this.data.purchase_items = (this.data.purchase_items || []).filter(item => item.purchase_id !== id);
    this.saveData();
    return { changes: initialLength - this.getPurchases().length };
  }
}

module.exports = PurchaseHandler;